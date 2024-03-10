import { createMethodDecorator } from './create-method-decorator'

export function ContentType(contentType: string): MethodDecorator {
  return createMethodDecorator({ contentType })
}
