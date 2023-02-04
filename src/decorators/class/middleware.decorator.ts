import { Container } from 'magnodi'

import { ScorpiMiddleware, Type } from '../../interfaces'

export function Middleware(): ClassDecorator {
  return (target: object): void => {
    const middleware = target as Type<ScorpiMiddleware>
    Container.provide(middleware, middleware)
  }
}
