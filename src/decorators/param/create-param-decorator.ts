import { ParamType } from '../../metadata'
import { ParamStorage } from '../../storages'

export function createParamDecorator(
  type: ParamType,
  valueHandler: (req: any, res: any) => any
): Function {
  return (target: object, propertyKey: string | symbol, parameterIndex: number): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ParamStorage.addParamMetadata({
      target: target.constructor,
      value: targetMethod,
      index: parameterIndex,
      getValue: valueHandler,
      type
    })
  }
}
