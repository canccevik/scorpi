import { Action } from '../decorators'

export interface ActionMetadata {
  target: object
  value: Function
  action: Action
}
