import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export function createParamDecorator(type: ParamType): Function {
  return (target: object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ParamStorage.addParamMetadata({
      target: target.constructor,
      value: targetMethod,
      index: parameterIndex,
      type
    })
  }
}
