import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class MisdirectedException extends HttpException {
  constructor(payload?: Object | string, description = 'Misdirected') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.MISDIRECTED),
      HttpStatus.MISDIRECTED
    )
  }
}
