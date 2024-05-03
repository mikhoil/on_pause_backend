import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreatePracticeDto } from './dto/createPractice.dto';

@Injectable()
export class PracticesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreatePracticeDto) {
    return await this.prisma.practice.create({ data: dto });
  }

  async getAll(userId: number) {
    const { subscriber } = await this.usersService.getUserById(userId);
    return await this.prisma.practice.findMany({
      include: {
        meditations: subscriber ? true : { select: { key: false } },
      },
    });
  }

  async delete(id: string) {
    const practice = await this.prisma.practice.findUnique({
      where: { id: +id },
      include: { meditations: true },
    });
    if (practice.meditations)
      await this.prisma.meditation.deleteMany({
        where: { practiceId: practice.id },
      });
    return await this.prisma.practice.delete({ where: { id: +id } });
  }

  async deleteAll() {
    return await this.prisma.practice.deleteMany({
      where: { meditations: {} },
    });
  }
}
