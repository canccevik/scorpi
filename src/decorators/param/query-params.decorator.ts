import { createParamDecorator } from './create-param-decorator'

export function QueryParams(propertyName?: string): Function {
  return createParamDecorator('query', {
    useValidator: true,
    propertyName
  })
}
