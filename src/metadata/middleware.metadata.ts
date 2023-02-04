import { Middleware } from '../interfaces'

export interface MiddlewareMetadata {
  target: object | Function
  value: Middleware
}
