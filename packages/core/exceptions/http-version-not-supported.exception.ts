import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class HttpVersionNotSupportedException extends HttpException {
  constructor(payload?: Object | string, description = 'HTTP Version Not Supported') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.HTTP_VERSION_NOT_SUPPORTED),
      HttpStatus.HTTP_VERSION_NOT_SUPPORTED
    )
  }
}
