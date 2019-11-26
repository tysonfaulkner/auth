import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor (
    private userService: UserService
  ) {}

  @Post('register')
  createUser(@Body(ValidationPipe) userAuthDto: UserAuthDto) {
    return this.userService.createUser(userAuthDto)
  }

  @Post('login')
  login(@Body(ValidationPipe) userAuthDto: UserAuthDto) {
    return this.userService.login(userAuthDto)
  }

}

