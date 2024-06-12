import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':email')
  getByEmail(@Query() email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }

  @Patch('subscription/on')
  addSubscription(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.userService.addSubscription(userId);
  }

  @Patch('subscription/off')
  cancelSubscription(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.userService.cancelSubscription(userId);
  }

  @Post('role/:id')
  addRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.addRole(+id, role);
  }

  @Patch('role/:id')
  removeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.removeRole(+id, role);
  }

  @Patch('add-session')
  addSession(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.userService.addSession(userId);
  }

  @Patch('increase-total-time')
  increaseTotalTime(@Req() req: Request, @Body('time') time: number) {
    const userId = req.user['userId'];
    return this.userService.increaseTotalTime(userId, time);
  }

  @Patch('update-strick')
  updateStrick(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.userService.updateStrick(userId);
  }
}
