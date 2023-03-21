import { createParamDecorator } from './create-param-decorator'

export function UploadedFile(propertyName: string, options?: any): Function {
  return createParamDecorator('file', {
    propertyName,
    options
  })
}
