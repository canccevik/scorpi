import { ParamType } from '../../metadata'
import { createParamDecorator } from './create-param-decorator'

export function Cookies(propertyName?: string): Function {
  return createParamDecorator(ParamType.COOKIES, {
    useValidator: true,
    propertyName
  })
}
