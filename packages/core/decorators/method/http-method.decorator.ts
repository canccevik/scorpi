import { HttpMethod, HttpStatus } from '../../enums'
import { createMethodDecorator } from './create-method-decorator'

export function Get(name: string | RegExp = '/'): MethodDecorator {
  return createMethodDecorator({ method: HttpMethod.GET, name })
}

export function Post(name: string | RegExp = '/'): MethodDecorator {
  return createMethodDecorator({ method: HttpMethod.POST, statusCode: HttpStatus.CREATED, name })
}

export function Put(name: string | RegExp = '/'): MethodDecorator {
  return createMethodDecorator({ method: HttpMethod.PUT, name })
}

export function Patch(name: string | RegExp = '/'): MethodDecorator {
  return createMethodDecorator({ method: HttpMethod.PATCH, name })
}

export function Delete(name: string | RegExp = '/'): MethodDecorator {
  return createMethodDecorator({ method: HttpMethod.DELETE, name })
}
