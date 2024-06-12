import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { S3clientModule } from 'src/s3client/s3client.module';
import { UsersModule } from 'src/users/users.module';
import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';

@Module({
  providers: [AffirmationsService],
  controllers: [AffirmationsController],
  imports: [PrismaModule, S3clientModule, AuthModule, UsersModule],
})
export class AffirmationsModule {}
