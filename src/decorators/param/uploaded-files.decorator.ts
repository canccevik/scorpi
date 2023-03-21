import { createParamDecorator } from './create-param-decorator'

export function UploadedFiles(propertyName: string, options?: any): Function {
  return createParamDecorator('files', {
    propertyName,
    options
  })
}
