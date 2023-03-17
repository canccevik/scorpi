import { createParamDecorator } from './create-param-decorator'

export function Params(): Function {
  return createParamDecorator((req) => req.params)
}
