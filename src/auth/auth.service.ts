import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { AuthLoginDto } from './dto/authLogin.dto';
import { AuthRegisterDto } from './dto/authRegister.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: AuthLoginDto) {
    const userId = (await this.validateUser(loginDto)).id;
    const tokens = await this.generateTokens(userId);
    await this.updateRefreshToken(tokens.refreshToken, userId);
    return tokens;
  }

  async register(registerDto: AuthRegisterDto) {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate)
      throw new HttpException(
        'Пользователь с таким email уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    const { password, ...userDto } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await this.userService.createUser({
      hashed_password: hashedPassword,
      ...userDto,
    });
    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async me(userId: number) {
    const { hashed_password, hashed_refresh_token, ...other } =
      await this.userService.getUserById(userId);
    return other;
  }

  private async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtService.decode(accessToken).exp,
    };
  }

  async updateRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 5);
    await this.userService.updateRefreshToken(hashedRefreshToken, userId);
  }

  async refreshTokens(refreshToken: string, userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.hashed_refresh_token)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async logout(userId: number) {
    return await this.userService.updateRefreshToken(null, userId);
  }

  private async validateUser(userDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.hashed_password,
    );
    if (user && passwordEquals) return user;
    throw new UnauthorizedException({
      message: 'Неверный логин или пароль',
    });
  }
}
