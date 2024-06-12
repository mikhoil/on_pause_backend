import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AffirmationsModule } from './affirmations/affirmations.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { MeditationsModule } from './meditations/meditations.module';
import { PracticesModule } from './practices/practices.module';
import { RolesModule } from './roles/roles.module';
import { S3clientModule } from './s3client/s3client.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    MeditationsModule,
    PracticesModule,
    AffirmationsModule,
    RolesModule,
    S3clientModule,
    TasksModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
