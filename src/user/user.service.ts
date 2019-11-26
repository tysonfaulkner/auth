import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { UserAuthDto } from './user.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './user.interface'

@Injectable()
export class UserService {
  private logger = new Logger('UserService')
  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>
    private jwtService: JwtService
  ) {}

  async createUser(userAuthDto: UserAuthDto): Promise<void> {
    const { email, password } = userAuthDto

    const user = new User()
    user.email = email
    user.hash = await bcrypt.hashSync(password, 12)
    user.joinDate = new Date()
    user.emailToken = crypto.randomBytes(16).toString('hex')
    user.emailVerified = false
    console.log(user.hash)
    console.log(user)

    try {
      await user.save()

      // send email with token for verification


    } catch (error) {
      if (error.code === '23505') { // duplicate email code 
        throw new ConflictException('Email already exists')
      } else {
        console.log(error)
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  async login(userAuthDto: UserAuthDto) {
    const { email, password } = userAuthDto
    const user = await User.findOne({ email })

    if (user && await bcrypt.compareSync(password, user.hash)) {

      // if(!user.emailVerified) {
      //   throw new UnauthorizedException(
      //     'This email is not verified, please click the link in the verification email to login'
      //   )
      // }

      const payload: JwtPayload = { email }
      console.log(this.jwtService)
      const token = await this.jwtService.sign(payload)
      this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)
      return {
        email: user.email,
        token,
      }
    } else {
      throw new UnauthorizedException('Invalid Credentials')
    }
  }
}
