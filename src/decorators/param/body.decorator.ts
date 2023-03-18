import { createParamDecorator } from './create-param-decorator'

export function Body(propertyName?: string): Function {
  return createParamDecorator('body', {
    useValidator: true,
    propertyName
  })
}
