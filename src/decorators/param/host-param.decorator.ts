import { createParamDecorator } from './create-param-decorator'

export function HostParam(): Function {
  return createParamDecorator((req) => req.hosts)
}