import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class UnauthorizedException extends HttpException {
  constructor(payload?: Object | string, description = 'Unauthorized') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED
    )
  }
}
