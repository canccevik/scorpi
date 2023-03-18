import { createParamDecorator } from './create-param-decorator'

export function Params(): Function {
  return createParamDecorator('params', true)
}
