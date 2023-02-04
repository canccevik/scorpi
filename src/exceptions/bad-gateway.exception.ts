import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class BadGatewayException extends HttpException {
  constructor(payload: Object | string, description = 'Bad Gateway') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.BAD_GATEWAY),
      HttpStatus.BAD_GATEWAY
    )
  }
}
