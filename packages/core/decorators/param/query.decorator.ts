import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Query(propertyName?: string): Function {
  return createParamDecorator(ParamType.QUERY, {
    useValidator: true,
    propertyName
  })
}
