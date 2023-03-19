import multer from 'multer'

import { createParamDecorator } from './create-param-decorator'

export function UploadedFiles(propertyName: string, options?: multer.Options): Function {
  return createParamDecorator('files', {
    propertyName,
    options
  })
}
