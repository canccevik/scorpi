import { createParamDecorator } from './create-param-decorator'

export function Cookies(propertyName?: string): Function {
  return createParamDecorator('cookies', {
    useValidator: true,
    propertyName
  })
}
