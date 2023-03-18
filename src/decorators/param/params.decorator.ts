import { createParamDecorator } from './create-param-decorator'

export function Params(propertyName?: string): Function {
  return createParamDecorator('params', {
    useValidator: true,
    propertyName
  })
}
