import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class InternalServerErrorException extends HttpException {
  constructor(payload?: Object | string, description = 'Internal Server Error') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
