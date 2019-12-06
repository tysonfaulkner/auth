import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserAuthDto, ResetPwDto, ForgotPwDto } from './user.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  createUser(@Body() userAuthDto: UserAuthDto) {
    return this.userService.createUser(userAuthDto)
  }

  @Post('login')
  login(@Body() userAuthDto: UserAuthDto) {
    return this.userService.login(userAuthDto)
  }

  @Get('confirm/:code')
  confirmEmail(@Param('code') code: string) {
    return this.userService.confirmEmail(code)
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPwDto: ForgotPwDto) {
    return this.userService.forgotPassword(forgotPwDto)
  }

  @Get('reset-password/:code')
  resetPasswordCheck(@Param('code') code: string) {
    return this.userService.resetPasswordCheck(code)
  }

  @Post('reset-password/:code')
  resetPassword(
    @Param('code') code: string,
    @Body() resetPwDto: ResetPwDto
  ) {
    return this.userService.resetPassword(code, resetPwDto)
  }

  @Post('test')
  @UseGuards(AuthGuard)
  test(@Req() req) {
    console.log(req)
  }
}
