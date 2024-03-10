import { Header } from '../../metadata'
import { createMethodDecorator } from './create-method-decorator'

export function Headers(...headers: Header[]): MethodDecorator {
  return createMethodDecorator({ headers })
}
