import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class ConflictException extends HttpException {
  constructor(payload?: Object | string, description = 'Conflict') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.CONFLICT),
      HttpStatus.CONFLICT
    )
  }
}
