import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Body(propertyName?: string): Function {
  return createParamDecorator(ParamType.BODY, {
    useValidator: true,
    propertyName
  })
}
