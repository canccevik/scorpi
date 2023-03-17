export type ParamType = 'req'

export interface ParamMetadata {
  target: object
  value: Function
  type: ParamType
  index: number
  getValue: (req: any, res: any) => any
}
