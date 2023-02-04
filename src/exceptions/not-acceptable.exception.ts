import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class NotAcceptableException extends HttpException {
  constructor(payload?: Object | string, description = 'Not Acceptable') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.NOT_ACCEPTABLE),
      HttpStatus.NOT_ACCEPTABLE
    )
  }
}
