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
    return await this.prisma.practice.delete({ where: { id: +id } });
  }
}
