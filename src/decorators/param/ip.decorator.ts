import { createParamDecorator } from './create-param-decorator'

export function Ip(): Function {
  return createParamDecorator('ip')
}
