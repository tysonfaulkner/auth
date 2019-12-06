import { createParamDecorator } from '@nestjs/common'

export const GetUserId = createParamDecorator((data, req): string => {
  return req.user.id
})