import { createMethodDecorator } from './create-method-decorator'

export function StatusCode(statusCode: number): MethodDecorator {
  return createMethodDecorator({ statusCode })
}
