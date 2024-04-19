import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePracticeDto } from './dto/createPractice.dto';

@Injectable()
export class PracticesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePracticeDto) {
    return await this.prisma.practice.create({ data: dto });
  }

  async getAll() {
    return await this.prisma.practice.findMany({
      include: { meditations: true },
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
}
