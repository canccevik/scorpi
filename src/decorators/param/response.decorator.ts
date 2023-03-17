import { createParamDecorator } from './create-param-decorator'

export function Response(): Function {
  return createParamDecorator('res')
}

export function Res(): Function {
  return createParamDecorator('res')
}
