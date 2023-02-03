import { Action } from '../../interfaces'
import { HttpMethod } from '../../enums'
import { TypeMetadataStorage } from '../../storages'

const defaultName = '/'

function createHttpMethodDecorator(
  method: HttpMethod,
  name: string | RegExp = defaultName
): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const targetMethod = target[propertyKey as keyof typeof target]
    const action: Action = { method, name }

    TypeMetadataStorage.addActionMetadata({
      target: target.constructor,
      method: targetMethod,
      action
    })
  }
}

export function Get(name?: string | RegExp): MethodDecorator {
  return createHttpMethodDecorator(HttpMethod.GET, name)
}

export function Post(name?: string | RegExp): MethodDecorator {
  return createHttpMethodDecorator(HttpMethod.POST, name)
}

export function Put(name?: string | RegExp): MethodDecorator {
  return createHttpMethodDecorator(HttpMethod.PUT, name)
}

export function Patch(name?: string | RegExp): MethodDecorator {
  return createHttpMethodDecorator(HttpMethod.PATCH, name)
}

export function Delete(name?: string | RegExp): MethodDecorator {
  return createHttpMethodDecorator(HttpMethod.DELETE, name)
}
