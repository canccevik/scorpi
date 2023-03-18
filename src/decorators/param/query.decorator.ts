import { createParamDecorator } from './create-param-decorator'

export function Query(propertyName?: string): Function {
  return createParamDecorator('query', {
    useValidator: true,
    propertyName
  })
}
