export type ParamType = 'req' | 'res'

export interface ParamMetadata {
  target: object
  value: Function
  type: ParamType
  index: number
  getValue: (req: any, res: any) => any
}
