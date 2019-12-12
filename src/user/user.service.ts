import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './user.interface'
import { SendEmail } from '../shared/emails'
import { User, EmailVerification, ResetPassword } from './user.entity'
import { UserAuthDto, ResetPwDto, ForgotPwDto } from './user.dto'
import { newUuid } from '../shared'

@Injectable()
export class UserService {
  private logger = new Logger('UserService')
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private sendEmail: SendEmail
  ) {}

  async createUser(userAuthDto: UserAuthDto): Promise<string> {
    const { email, password } = userAuthDto

    if (await this.userRepository.findOne({ email })) {
      throw new ConflictException(`Email ${email} is already registered, try logging in`)
    }

    const user = new User()
    user.id = newUuid()
    user.email = email
    user.hash = await bcrypt.hashSync(password, 12)

    const verify = new EmailVerification()
    verify.code = crypto.randomBytes(16).toString('hex')

    try {
      await this.userRepository.save(user)
      
      verify.user = user.id
      await this.emailVerificationRepository.save(verify)

      return this.sendEmail.accountVerificationCode(email, verify.code) 
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async login(userAuthDto: UserAuthDto): Promise<{ email: string, token: string }> {
    const { email, password } = userAuthDto
    const user = await this.userRepository.findOne({ email })

    if (user && (await bcrypt.compareSync(password, user.hash))) {
      if(!user.emailVerified) {
        throw new UnauthorizedException(
          'This email is not verified, please click the link in the verification email to login'
        )
      }

      const roles = user.roles
      const payload: JwtPayload = { email }
      console.log(this.jwtService)
      const token = await this.jwtService.sign(payload)
      this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)
      return {
        email,
        token,
      }
    } else {
      throw new UnauthorizedException('Invalid Credentials')
    }
  }

  async confirmEmail(code: string) {
    const verify = await this.emailVerificationRepository.findOne({ code })
    if (!verify) {
      throw new NotFoundException('Can\'t verify email, please sign up again or login')
    }
    const user = await this.userRepository.findOne(verify.user)
    user.roles = ['user']
    user.emailVerified = true
    try {
      await this.userRepository.save(user)
      await this.emailVerificationRepository.remove(verify)  
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
    return this.sendEmail.accountVerificationSuccess(user.email)
  }

  async forgotPassword(forgotPwDto: ForgotPwDto) {
    const { email } = forgotPwDto
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      throw new NotFoundException('No account with that email address')
    }

    const resetPw = new ResetPassword()
    resetPw.user = user.id
    resetPw.code = crypto.randomBytes(16).toString('hex')

    try {
      await this.resetPasswordRepository.save(resetPw)
      return this.sendEmail.resetPasswordRequest(email, resetPw.code)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async resetPasswordCheck(code: string): Promise<string> {
    const resetPw = await this.resetPasswordRepository.findOne({ code })
    if (!resetPw ) {
      throw new UnauthorizedException('Invalid reset password request')
    }
    const expiresIn = 24 * 60 * 60 * 1000// 24 hours in milliseconds
    const codeExpireTime = resetPw.createdDate.getTime() + expiresIn
    if (codeExpireTime < Date.now()) {
      await this.resetPasswordRepository.remove(resetPw)
      throw new UnauthorizedException('Reset request has expired')
    }
    const user = await this.userRepository.findOne(resetPw.user)
    return user.email
  }

  async resetPassword(code: string, resetPwDto: ResetPwDto): Promise<string> {
    const { password } = resetPwDto
    const email = await this.resetPasswordCheck(code)
    const user = await this.userRepository.findOne({ email })
    user.hash = await bcrypt.hashSync(password, 12)
    try {
      await this.userRepository.save(user)
      await this.resetPasswordRepository.delete({ code })
      return this.sendEmail.resetPasswordSuccess(email) 
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
  
}


