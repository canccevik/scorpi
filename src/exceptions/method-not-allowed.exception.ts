import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class MethodNotAllowedException extends HttpException {
  constructor(payload?: Object | string, description = 'Method Not Allowed') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.METHOD_NOT_ALLOWED),
      HttpStatus.METHOD_NOT_ALLOWED
    )
  }
}
