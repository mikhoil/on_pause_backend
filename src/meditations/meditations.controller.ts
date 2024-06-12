import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: CreateMeditationDto) {
    return this.meditationsService.create(dto, files.audio[0], files.image[0]);
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

  @Patch('history/:id')
  addToUserHistory(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user['userId'];
    return this.meditationsService.addToUserHistory(+id, userId);
  }

  @Delete('history/clear')
  clearHistory(@Req() req: Request) {
    return this.meditationsService.clearHistory(req.user['userId']);
  }

  @Patch('update')
  updateHistoryAndStats(
    @Req() req: Request,
    @Body() { id, time }: { id: number; time: number },
  ) {
    const userId = req.user['userId'];
    return this.meditationsService.updateHistoryAndStats(id, time, userId);
  }
}
