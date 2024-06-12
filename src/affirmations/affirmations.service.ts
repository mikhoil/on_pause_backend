import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3clientService } from 'src/s3client/s3client.service';
import { v4 } from 'uuid';

@Injectable()
export class AffirmationsService {
  constructor(
    private prisma: PrismaService,
    private s3client: S3clientService,
  ) {}

  async create(text: string, file) {
    const key = v4() + '.' + file.originalname.split('.')[1];
    await this.s3client.send(
      new PutObjectCommand({
        Key: key,
        Bucket: 'on-pause-affirmations',
        Body: file.buffer,
      }),
    );
    return await this.prisma.affirmation.create({ data: { text, image: key } });
  }

  async delete(id: number) {
    const meditation = await this.prisma.affirmation.delete({ where: { id } });
    await this.s3client.send(
      new DeleteObjectCommand({
        Bucket: 'on-pause-affirmations',
        Key: meditation.image,
      }),
    );
    return meditation;
  }

  async getOne(offset: number) {
    const dayOfYear = Math.floor(
      (Date.now() -
        new Date(new Date().getFullYear(), 0, 1).getTime() +
        offset +
        new Date().getTimezoneOffset() / 60) /
        (3600000 * 24),
    );
    const amount = await this.prisma.affirmation.count();
    return await this.prisma.affirmation.findFirst({
      skip: dayOfYear > 0 ? (dayOfYear - 1) % amount : dayOfYear,
    });
  }
}
