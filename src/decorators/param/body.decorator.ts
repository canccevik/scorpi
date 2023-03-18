import { createParamDecorator } from './create-param-decorator'

export function Body(): Function {
  return createParamDecorator('body', true)
}
