import { Container } from 'magnodi'

import { Middleware, ScorpiMiddleware, Type } from '../../interfaces'
import { TypeMetadataStorage } from '../../storages'

export function UseMiddleware(middlewares: Middleware | Middleware[]): Function {
  return (target: object, propertyKey?: string | symbol): void => {
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares]
    }

    const targetMethod = target[propertyKey as keyof typeof target]

    middlewares.forEach((middleware) => {
      let value = middleware

      if (typeof middleware.prototype.use === 'function') {
        const middlewareInstance = Container.resolve<ScorpiMiddleware>(
          middleware as Type<ScorpiMiddleware>
        )
        value = middlewareInstance.use.bind(middlewareInstance)
      }

      TypeMetadataStorage.addMiddlewareMetadata({
        target: targetMethod || target,
        value
      })
    })
  }
}
