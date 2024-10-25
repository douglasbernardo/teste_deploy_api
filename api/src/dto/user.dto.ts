import { IsEmail, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  readonly name: string;
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly password: string;

  @IsString()
  readonly confirmPassword: string;
}

export class signInDto extends OmitType(UserDto, [
  'name',
  'confirmPassword',
] as const) {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
}
