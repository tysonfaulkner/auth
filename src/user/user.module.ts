import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, EmailVerification, ResetPassword } from './user.entity'
import { JwtModule } from '@nestjs/jwt'
import * as config from 'config'
import { SendEmail } from '../shared'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User, EmailVerification, ResetPassword])
  ],
  providers: [UserService, SendEmail],
  controllers: [UserController],
})
export class UserModule {}
