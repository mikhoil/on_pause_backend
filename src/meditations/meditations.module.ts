import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  controllers: [MeditationsController],
  providers: [MeditationsService],
  imports: [PrismaModule],
})
export class MeditationsModule {}
