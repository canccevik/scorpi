import { Action } from '../interfaces'

export interface ActionMetadata {
  target: object
  value: Function
  action: Action
}
