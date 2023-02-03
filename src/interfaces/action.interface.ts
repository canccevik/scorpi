import { HttpMethod } from '../enums'

export interface Action {
  name: string | RegExp
  method: HttpMethod
}
