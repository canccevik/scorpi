import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class RequestTimeoutException extends HttpException {
  constructor(payload?: Object | string, description = 'Request Timeout') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.REQUEST_TIMEOUT),
      HttpStatus.REQUEST_TIMEOUT
    )
  }
}
