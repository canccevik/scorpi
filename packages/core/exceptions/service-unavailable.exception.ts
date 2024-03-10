import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class ServiceUnavailableException extends HttpException {
  constructor(payload?: Object | string, description = 'Service Unavailable') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.SERVICE_UNAVAILABLE),
      HttpStatus.SERVICE_UNAVAILABLE
    )
  }
}
