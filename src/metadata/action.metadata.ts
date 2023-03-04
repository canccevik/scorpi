import { HttpMethod } from '../enums'

export interface Action {
  name?: string | RegExp
  method?: HttpMethod
  statusCode?: number
  redirectUrl?: string
  contentType?: string
  locationUrl?: string
}

export interface ActionMetadata {
  target: object
  value: Function
  action: Action
}
