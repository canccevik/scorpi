import { createMethodDecorator } from './create-method-decorator'

export function Location(url: string): MethodDecorator {
  return createMethodDecorator({ locationUrl: url })
}
