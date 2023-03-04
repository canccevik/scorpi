import { Header } from '../../metadata'
import { createMethodDecorator } from '../../utils'

export function Headers(...headers: Header[]): MethodDecorator {
  return createMethodDecorator({ headers })
}
