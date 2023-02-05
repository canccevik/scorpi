import { ScorpiExceptionHandler } from './scorpi-exception-handler.interface'
import { Type } from './type.interface'

export interface AdapterOptions {
  globalPrefix?: string
  exceptionHandler?: Type<ScorpiExceptionHandler>
}
