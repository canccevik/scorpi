import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export interface ParamOptions {
  useValidator?: boolean
  propertyName?: string
  options?: any
}

export function createParamDecorator(paramType: ParamType, options?: ParamOptions): Function {
  return (target: object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    const type = Reflect.getMetadata('design:paramtypes', target, propertyKey).at(parameterIndex)

    ParamStorage.addParamMetadata({
      target: target.constructor,
      value: targetMethod,
      index: parameterIndex,
      useValidator: options?.useValidator ?? false,
      propertyName: options?.propertyName,
      options: options?.options,
      paramType,
      type
    })
  }
}
