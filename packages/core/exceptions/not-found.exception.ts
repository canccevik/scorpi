import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class NotFoundException extends HttpException {
  constructor(payload?: Object | string, description = 'Not Found') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND
    )
  }
}
