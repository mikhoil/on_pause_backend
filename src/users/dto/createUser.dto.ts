import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Email should be valid' })
  readonly email: string;
  @IsString({ message: 'Username should be a string' })
  readonly username: string;
  @IsString({ message: 'Password should be a string' })
  @Length(6, 20, { message: 'Password should be between 6 and 20 characters' })
  readonly hashed_password: string;
}
