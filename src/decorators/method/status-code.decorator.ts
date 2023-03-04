import { Action } from '../../metadata'
import { ActionStorage } from '../../storages'

export function StatusCode(statusCode: number): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const targetMethod = target[propertyKey as keyof typeof target]
    const action: Action = { statusCode }

    ActionStorage.addActionMetadata({
      target: target.constructor,
      value: targetMethod,
      action
    })
  }
}
