import { Injectable } from '@nestjs/common';
import { MeditationsService } from 'src/meditations/meditations.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreatePracticeDto } from './dto/createPractice.dto';

@Injectable()
export class PracticesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private meditationsService: MeditationsService,
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

  async delete(id: number) {
    const practice = await this.prisma.practice.findUnique({
      where: { id },
      include: { meditations: true },
    });
    practice.meditations.forEach(meditation =>
      this.meditationsService.delete(meditation.id),
    );
    return await this.prisma.practice.delete({ where: { id } });
  }

  async deleteAll() {
    return await this.prisma.practice.deleteMany({
      where: { meditations: {} },
    });
  }
}
