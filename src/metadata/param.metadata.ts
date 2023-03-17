export interface ParamMetadata {
  target: object
  value: Function
  index: number
  getValue: (req: any, res: any) => any
}
