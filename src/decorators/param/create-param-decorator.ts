import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export function createParamDecorator(paramType: ParamType, useValidator = false): Function {
  return (target: object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    const type = Reflect.getMetadata('design:paramtypes', target, propertyKey).at(parameterIndex)

    ParamStorage.addParamMetadata({
      target: target.constructor,
      value: targetMethod,
      index: parameterIndex,
      useValidator,
      paramType,
      type
    })
  }
}
