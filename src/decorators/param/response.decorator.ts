import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Response(): Function {
  return createParamDecorator(ParamType.RESPONSE)
}

export function Res(): Function {
  return createParamDecorator(ParamType.RESPONSE)
}
