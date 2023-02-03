import { AdapterOptions } from './adapter-options.interface'
import { Type } from './type.interface'

export interface ScorpiOptions extends AdapterOptions {
  controllers: Type[]
}
