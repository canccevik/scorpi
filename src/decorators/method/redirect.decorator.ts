import { createMethodDecorator } from '../../utils'

export function Redirect(url: string): MethodDecorator {
  return createMethodDecorator({ redirectUrl: url })
}
