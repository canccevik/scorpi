import { createParamDecorator } from './create-param-decorator'

export function QueryParams(): Function {
  return createParamDecorator((req) => req.query)
}