import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class NotImplementedException extends HttpException {
  constructor(payload?: Object | string, description = 'Not Implemented') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.NOT_IMPLEMENTED),
      HttpStatus.NOT_IMPLEMENTED
    )
  }
}
