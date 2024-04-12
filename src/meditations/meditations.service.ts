import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeditationDto } from './dto/createMeditation.dto';

@Injectable()
export class MeditationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMeditationDto) {
    return await this.prisma.meditation.create({ data: dto });
  }

  async getAll() {
    return await this.prisma.meditation.findMany();
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
