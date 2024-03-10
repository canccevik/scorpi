export enum ParamType {
  REQUEST,
  RESPONSE,
  BODY,
  COOKIES,
  HEADERS,
  HOSTS,
  IP,
  PARAMS,
  QUERY,
  SESSION,
  FILE,
  FILES
}

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
