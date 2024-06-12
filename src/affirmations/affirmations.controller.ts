import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { AffirmationsService } from './affirmations.service';

@Controller('affirmations')
export class AffirmationsController {
  constructor(private affirmationsService: AffirmationsService) {}

  @Get()
  getTodayAffirmation(@Query('offset') offset: string) {
    return this.affirmationsService.getOne(+offset);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'affirmation', maxCount: 1 }]),
  )
  create(@UploadedFiles() files, @Body() { text }: { text: string }) {
    return this.affirmationsService.create(text, files.affirmation[0]);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.affirmationsService.delete(+id);
  }
}
