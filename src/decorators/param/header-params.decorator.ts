import { createParamDecorator } from './create-param-decorator'

export function HeaderParams(): Function {
  return createParamDecorator('headers')
}
