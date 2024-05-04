import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3clientModule } from 'src/s3client/s3client.module';
import { UsersModule } from 'src/users/users.module';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  controllers: [MeditationsController],
  providers: [MeditationsService],
  imports: [PrismaModule, UsersModule, AuthModule, S3clientModule],
  exports: [MeditationsService],
})
export class MeditationsModule {}
