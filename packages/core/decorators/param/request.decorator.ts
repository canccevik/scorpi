import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Request(): Function {
  return createParamDecorator(ParamType.REQUEST)
}

export function Req(): Function {
  return createParamDecorator(ParamType.REQUEST)
}
