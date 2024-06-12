import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  @Interval(12 * 60 * 60 * 1000)
  async increaseUsersLimit() {
    await this.prisma.user.updateMany({
      where: { limit: { lt: 20 } },
      data: { limit: { increment: 10 } },
    });
  }

  @Interval(60 * 60 * 1000)
  async decreaseUsersProgressPerHour() {
    const userWithLimitLT20 = await this.prisma.user.findMany({
      where: { limit: { lt: 20 } },
    });
    userWithLimitLT20.forEach(async ({ progress, id, limit }) => {
      await this.prisma.user.update({
        where: { id },
        data: {
          progress: Math.max(progress - (limit === 0 ? 0.4 : 0.2), 0),
        },
      });
    });
  }

  @Interval(24 * 60 * 60 * 1000)
  async resetUsersProgressPerDay() {
    const usersWithLimit20 = await this.prisma.user.findMany({
      where: { limit: 20 },
    });
    usersWithLimit20.forEach(async ({ progress, id }) => {
      await this.prisma.user.update({
        where: { id },
        data: {
          progress: Math.max(progress - 5, 0),
        },
      });
    });
  }
}
