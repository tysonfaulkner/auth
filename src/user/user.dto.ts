import { IsNotEmpty, IsEmail } from 'class-validator'

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}

export class ForgotPwDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}

export class ResetPwDto {
  @IsNotEmpty()
  readonly password: string
}