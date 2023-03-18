import { createParamDecorator } from './create-param-decorator'

export function Host(): Function {
  return createParamDecorator('hosts')
}
