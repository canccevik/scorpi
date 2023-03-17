import { createParamDecorator } from './create-param-decorator'

export function CookieParams(): Function {
  return createParamDecorator((req) => req.cookies)
}
