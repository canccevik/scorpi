import { createMethodDecorator } from './create-method-decorator'

export function Render(view: string): MethodDecorator {
  return createMethodDecorator({ render: view })
}
