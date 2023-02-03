import { Action } from '@interfaces/index'

export interface ActionMetadata {
  target: object
  method: Function
  action: Action
}
