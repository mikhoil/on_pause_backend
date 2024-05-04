import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { CreateMeditationDto } from './dto/createMeditation.dto';
import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private meditationsService: MeditationsService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'meditation', maxCount: 1 }]))
  create(@UploadedFiles() files, @Body() dto: CreateMeditationDto) {
    return this.meditationsService.create(dto, files.meditation[0]);
  }

  @Get()
  getAll(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.meditationsService.getAll(userId);
  }

  @Get()
  getByPracticeId(@Query('practiceId') practiceId: string) {
    return this.meditationsService.getByPracticeId(+practiceId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.meditationsService.getById(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.meditationsService.delete(+id);
  }
}
