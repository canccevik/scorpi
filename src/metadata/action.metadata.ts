import { Action } from '../interfaces'

export interface ActionMetadata {
  target: object
  method: Function
  action: Action
}
