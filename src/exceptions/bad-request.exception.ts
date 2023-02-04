import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class BadRequestException extends HttpException {
  constructor(payload?: Object | string, description = 'Bad Request') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST
    )
  }
}
