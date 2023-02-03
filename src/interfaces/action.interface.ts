import { HttpMethod } from '@enums/index'

export interface Action {
  name: string | RegExp
  method: HttpMethod
}
