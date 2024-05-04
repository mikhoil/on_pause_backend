import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MeditationsModule } from 'src/meditations/meditations.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  controllers: [PracticesController],
  providers: [PracticesService],
  imports: [PrismaModule, AuthModule, UsersModule, MeditationsModule],
})
export class PracticesModule {}
