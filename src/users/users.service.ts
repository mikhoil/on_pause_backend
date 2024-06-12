import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: dto,
      include: { roles: true, history: true },
    });
  }

  async deleteUserById(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({
      include: { roles: true, history: true },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        history: { include: { meditations: true }, orderBy: { date: 'desc' } },
        roles: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true, history: true },
    });
  }

  async addSubscription(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: { subscriber: true },
      include: { history: true },
    });
  }

  async cancelSubscription(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: { subscriber: false },
      include: { history: true },
    });
  }

  async addRole(id: number, value: string) {
    const role = await this.rolesService.getRoleByValue(value);
    await this.prisma.user.update({
      where: { id },
      data: { roles: { connect: { id: role.id } } },
    });
  }

  async removeRole(userId: number, role: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { roles: { delete: { value: role } } },
      include: { roles: true },
    });
  }

  async updateRefreshToken(hashedRefreshToken: string | null, id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { hashed_refresh_token: hashedRefreshToken },
    });
  }

  async addSession(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { total_sessions: { increment: 1 } },
    });
  }

  async increaseTotalTime(id: number, time: number) {
    await this.prisma.user.update({
      where: { id },
      data: { total_time: { increment: time } },
    });
  }

  async updateStrick(userId: number) {
    const todayHistory = await this.prisma.historyItem.findUnique({
      where: {
        date_userId: {
          userId,
          date: new Date(new Date().toDateString()).getTime() / 1000,
        },
      },
      include: { meditations: true },
    });
    if (todayHistory && todayHistory.meditations.length === 1) {
      const yesterdayHistory = await this.prisma.historyItem.findUnique({
        where: {
          date_userId: {
            userId,
            date:
              new Date(new Date().toDateString()).getTime() / 1000 - 24 * 3600,
          },
        },
      });
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          daily_strick: yesterdayHistory ? { increment: 1 } : { set: 1 },
        },
      });
    }
  }

  async increaseProgress(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        progress:
          user.limit > 0 ? Math.min(user.progress + 10, 100) : user.progress,
        limit: user.limit > 0 ? Math.max(user.limit - 10, 0) : user.limit,
      },
    });
  }
}
