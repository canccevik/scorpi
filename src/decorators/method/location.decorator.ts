import { createMethodDecorator } from '../../utils'

export function Location(url: string): MethodDecorator {
  return createMethodDecorator({ locationUrl: url })
}
