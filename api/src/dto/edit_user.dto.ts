import { IsEmail, IsOptional } from 'class-validator';

export class editDto {
  @IsEmail()
  readonly currentEmail: string;
  @IsOptional()
  readonly name: string;
  @IsOptional()
  readonly email: string;
  @IsOptional()
  readonly password: string;
}
