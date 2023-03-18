import { createParamDecorator } from './create-param-decorator'

export function CookieParams(propertyName?: string): Function {
  return createParamDecorator('cookies', {
    useValidator: true,
    propertyName
  })
}
