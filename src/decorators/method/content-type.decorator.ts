import { createMethodDecorator } from '../../utils'

export function ContentType(contentType: string): MethodDecorator {
  return createMethodDecorator({ contentType })
}
