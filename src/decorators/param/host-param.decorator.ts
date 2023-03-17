import { createParamDecorator } from './create-param-decorator'

export function HostParam(): Function {
  return createParamDecorator('hosts')
}
