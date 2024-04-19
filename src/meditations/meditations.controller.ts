import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { log } from 'console';
import { CreateMeditationDto } from './dto/createMeditation.dto';
import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private meditationsService: MeditationsService) {}

  @Post('/create')
  create(@Body() dto: CreateMeditationDto) {
    return this.meditationsService.create(dto);
  }

  @Get()
  getAll() {
    return this.meditationsService.getAll();
  }

  // @UseInterceptors(CheckSubscriptionInterceptor)

  @Get()
  getByPracticeId(@Query('practiceId') practiceId: string) {
    log(practiceId);
    return this.meditationsService.getByPracticeId(practiceId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    log(id);
    return this.meditationsService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.meditationsService.delete(id);
  }
}
