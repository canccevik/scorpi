import { createParamDecorator } from './create-param-decorator'

export function Request(): Function {
  return createParamDecorator((req) => req)
}

export function Req(): Function {
  return createParamDecorator((req) => req)
}
