import multer from 'multer'

import { createParamDecorator } from './create-param-decorator'

export function UploadedFile(propertyName: string, options?: multer.Options): Function {
  return createParamDecorator('file', {
    propertyName,
    options
  })
}
