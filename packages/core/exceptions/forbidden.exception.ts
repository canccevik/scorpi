import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class ForbiddenException extends HttpException {
  constructor(payload?: Object | string, description = 'Forbidden') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.FORBIDDEN),
      HttpStatus.FORBIDDEN
    )
  }
}
