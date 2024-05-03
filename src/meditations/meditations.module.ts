import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  controllers: [MeditationsController],
  providers: [MeditationsService],
  imports: [PrismaModule, UsersModule, AuthModule],
})
export class MeditationsModule {}
