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

  async create(
    { duration, practiceId, ...dto }: CreateMeditationDto,
    audioFile,
    imageFile,
  ) {
    const audio = v4() + '.' + audioFile.originalname.split('.')[1];
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: audio,
        Body: audioFile.buffer,
      }),
    );
    const image = v4() + '.' + imageFile.originalname.split('.')[1];
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: image,
        Body: imageFile.buffer,
      }),
    );
    return await this.prisma.meditation.create({
      data: {
        audio,
        image,
        duration: +duration,
        practiceId: +practiceId,
        ...dto,
      },
    });
  }

  async getAll(userId: number) {
    const { subscriber } = await this.usersService.getUserById(userId);
    return await this.prisma.meditation.findMany({
      select: {
        audio: subscriber,
        duration: true,
        practiceId: true,
        forSubs: true,
        id: true,
        title: true,
      },
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
      where: { id },
    });
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: meditation.audio,
      }),
    );
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'on-pause-meditations',
        Key: meditation.image,
      }),
    );
    return meditation;
  }

  async addToUserHistory(id: number, userId: number) {
    const date = new Date(new Date().toDateString()).getTime() / 1000;
    const userHistory = await this.prisma.historyItem.findMany({
      where: { userId },
    });
    if (!userHistory.some(historyItem => historyItem.date === date)) {
      const meditation = await this.getById(id);
      console.log(meditation);
      await this.prisma.historyItem.create({
        data: {
          date,
          userId,
          meditations: { connect: { id } },
        },
      });
    } else
      await this.prisma.historyItem.update({
        where: { date_userId: { date, userId } },
        data: { meditations: { connect: { id } } },
      });
  }

  async clearHistory(userId: number) {
    return await this.prisma.historyItem.deleteMany({ where: { userId } });
  }

  async updateHistoryAndStats(id: number, time: number, userId: number) {
    await this.addToUserHistory(id, userId);
    await this.usersService.addSession(userId);
    await this.usersService.increaseTotalTime(userId, time);
    await this.usersService.updateStrick(userId);
    await this.usersService.increaseProgress(userId);
    return await this.usersService.getUserById(userId);
  }
}
