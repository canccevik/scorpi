import { ScorpiMiddleware } from './scorpi-middleware.interface'
import { Type } from './type.interface'

export type Middleware = Function | Type<ScorpiMiddleware>
