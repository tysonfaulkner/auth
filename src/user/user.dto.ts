import { IsNotEmpty, IsEmail } from 'class-validator'

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}
