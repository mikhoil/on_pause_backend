import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { UsersModule } from 'src/users/users.module';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  controllers: [PracticesController],
  providers: [PracticesService, RolesGuard],
  imports: [PrismaModule, AuthModule, UsersModule],
})
export class PracticesModule {}
