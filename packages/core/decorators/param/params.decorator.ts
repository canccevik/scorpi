import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Params(propertyName?: string): Function {
  return createParamDecorator(ParamType.PARAMS, {
    useValidator: true,
    propertyName
  })
}
