import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, EmailVerification, ResetPassword } from './user.entity'
import { JwtModule } from '@nestjs/jwt'
import * as config from 'config'
import { SendEmail } from '../shared'
import { JwtStrategy } from './user.jwt-strategy'

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
  controllers: [UserController],
  providers: [UserService, SendEmail, JwtStrategy],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class UserModule {}
