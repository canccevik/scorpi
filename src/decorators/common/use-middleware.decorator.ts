import { Middleware } from '../../interfaces'
import { TypeMetadataStorage } from '../../storages'

export function UseMiddleware(middlewares: Middleware | Middleware[]): Function {
  return (target: object, propertyKey?: string | symbol): void => {
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares]
    }

    const targetMethod = target[propertyKey as keyof typeof target]

    middlewares.forEach((middleware) => {
      TypeMetadataStorage.addMiddlewareMetadata({
        target: targetMethod || target,
        value: middleware
      })
    })
  }
}
