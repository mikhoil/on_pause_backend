import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/addRole.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({ data: dto });
  }

  async deleteUserById(userId: number) {
    return await this.prisma.user.delete({ where: { id: userId } });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({ include: { roles: true } });
  }

  async getUserById(userId: number) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }

  async cancelSubscription(email: string) {
    return await this.prisma.user.update({
      where: { email },
      data: { subscriber: false },
    });
  }

  async addRole(dto: AddRoleDto) {
    const role = await this.rolesService.getRoleByValue(dto.value);
    return await this.prisma.user.update({
      where: { id: dto.userId },
      data: { roles: { connect: { id: role.id } } },
    });
  }
}
