import { HttpMethod } from '../enums'

export interface Header {
  key: string
  value: string
}

export interface Action {
  name?: string | RegExp
  method?: HttpMethod
  statusCode?: number
  redirectUrl?: string
  contentType?: string
  locationUrl?: string
  headers?: Header[]
  render?: string
}

export interface ActionMetadata {
  target: object
  value: Function
  action: Action
}
