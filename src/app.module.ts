import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { MeditationsModule } from './meditations/meditations.module';
import { PracticesModule } from './practices/practices.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { S3clientModule } from './s3client/s3client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    MeditationsModule,
    PracticesModule,
    RolesModule,
    S3clientModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
