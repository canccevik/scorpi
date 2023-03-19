export type ParamType =
  | 'req'
  | 'res'
  | 'body'
  | 'cookies'
  | 'headers'
  | 'hosts'
  | 'ip'
  | 'params'
  | 'query'
  | 'session'
  | 'file'
  | 'files'

export interface ParamMetadata {
  target: object
  value: Function
  index: number
  paramType: ParamType
  useValidator: boolean
  type: any
  propertyName?: string
  options?: any
}
