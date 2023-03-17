import { createMethodDecorator } from './create-method-decorator'

export function Redirect(url: string): MethodDecorator {
  return createMethodDecorator({ redirectUrl: url })
}
