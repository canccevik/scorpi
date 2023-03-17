import { createParamDecorator } from './create-param-decorator'

export function Session(): Function {
  return createParamDecorator((req) => req.session)
}
