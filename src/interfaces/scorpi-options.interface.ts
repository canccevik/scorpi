import { AdapterOptions } from './adapter-options.interface'
import { Middleware } from './middleware.interface'
import { Type } from './type.interface'

export interface ScorpiOptions extends AdapterOptions {
  controllers: Type[]
  middlewares?: Middleware[]
}
