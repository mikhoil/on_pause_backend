import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { CreatePracticeDto } from './dto/createPractice.dto';
import { PracticesService } from './practices.service';

@Controller('practices')
export class PracticesController {
  constructor(private practicesService: PracticesService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('/create')
  create(@Body() dto: CreatePracticeDto) {
    return this.practicesService.create(dto);
  }

  @Get()
  getAll(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.practicesService.getAll(userId);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.practicesService.delete(+id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete()
  deleteAll() {
    return this.practicesService.deleteAll();
  }
}
