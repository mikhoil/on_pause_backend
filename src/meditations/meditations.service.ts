import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3clientService } from 'src/s3client/s3client.service';
import { UsersService } from 'src/users/users.service';
import { v4 } from 'uuid';
import { CreateMeditationDto } from './dto/createMeditation.dto';

@Injectable()
export class MeditationsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private s3Client: S3clientService,
  ) {}

  async create({ duration, practiceId, ...dto }: CreateMeditationDto, file) {
    const key = v4();
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: key + '.mp3',
        Body: file.buffer,
      }),
    );
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

  async getById(id: number) {
    return await this.prisma.meditation.findUnique({ where: { id } });
  }

  async getByPracticeId(practiceId: number) {
    return await this.prisma.meditation.findMany({
      where: { practiceId },
    });
  }

  async delete(id: number) {
    const meditation = await this.prisma.meditation.delete({
      where: { id: +id },
    });
    this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: meditation.key + '.mp3',
      }),
    );
    return meditation;
  }
}
