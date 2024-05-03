import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';
import { CreateMeditationDto } from './dto/createMeditation.dto';

@Injectable()
export class MeditationsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create({ duration, practiceId, ...dto }: CreateMeditationDto, file) {
    const key = v4();
    return await this.prisma.meditation.create({
      data: { key, duration: +duration, practiceId: +practiceId, ...dto },
    });
  }

  async getAll(userId: number) {
    const { subscriber } = await this.usersService.getUserById(userId);
    return await this.prisma.meditation.findMany({
      select: subscriber ? {} : { key: false },
    });
  }

  async getById(id: string) {
    return await this.prisma.meditation.findUnique({ where: { id: +id } });
  }

  async getByPracticeId(practiceId: string) {
    return await this.prisma.meditation.findMany({
      where: { practiceId: +practiceId },
    });
  }

  async delete(id: string) {
    return await this.prisma.meditation.delete({ where: { id: +id } });
  }
}
