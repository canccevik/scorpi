import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Session(): Function {
  return createParamDecorator(ParamType.SESSION)
}
