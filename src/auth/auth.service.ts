import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    return await this.generateToken(await this.validateUser(userDto));
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate)
      throw new HttpException(
        'Пользователь с таким email уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    const hashedPassword = await bcrypt.hash(userDto.hashed_password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      hashed_password: hashedPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const { hashed_password, ...others } = user;
    return { token: this.jwtService.sign(others) };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.hashed_password,
      user.hashed_password,
    );
    if (user && passwordEquals) return user;
    throw new UnauthorizedException({
      message: 'Неверный логин или пароль',
    });
  }
}
