import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CheckSubscriptionInterceptor } from 'src/meditations/interseptors/checkSubscriptionInterseptor';
import { CreatePracticeDto } from './dto/createPractice.dto';
import { PracticesService } from './practices.service';

@Controller('practices')
export class PracticesController {
  constructor(private practicesService: PracticesService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/create')
  create(@Body() dto: CreatePracticeDto) {
    return this.practicesService.create(dto);
  }

  @UseInterceptors(CheckSubscriptionInterceptor)
  @Get()
  getAll() {
    return this.practicesService.getAll();
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.practicesService.delete(id);
  }
}
