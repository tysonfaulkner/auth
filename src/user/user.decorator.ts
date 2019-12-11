import {
  createParamDecorator,
  applyDecorators,
  SetMetadata,
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (roles.length === 0) {
      return true
    }
    console.log(roles)
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const hasRole = () => user.roles.some(role => roles.includes(role))
    return user && user.roles && hasRole()
  }
}

export function Roles(...roles) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard)
  )
}

export const GetUserId = createParamDecorator((data, req): string => {
  return req.user
})
