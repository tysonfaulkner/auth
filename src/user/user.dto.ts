import { IsNotEmpty, IsEmail, IsString } from 'class-validator'

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly password: string
}

export class ForgotPwDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}

export class ResetPwDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string
}