import { createMethodDecorator } from '../../utils'

export function StatusCode(statusCode: number): MethodDecorator {
  return createMethodDecorator({ statusCode })
}
