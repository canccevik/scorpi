import { HttpMethod } from '../enums'

export interface Action {
  name: string | RegExp
  method: HttpMethod
}

export interface ActionMetadata {
  target: object
  value: Function
  action: Action
}
