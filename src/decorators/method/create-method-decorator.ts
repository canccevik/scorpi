import { Action } from '../../metadata'
import { ActionStorage } from '../../storages'

export function createMethodDecorator(action: Action): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const targetMethod = target[propertyKey as keyof typeof target]

    ActionStorage.addActionMetadata({
      target: target.constructor,
      value: targetMethod,
      action
    })
  }
}
