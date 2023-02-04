import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class ImATeapotException extends HttpException {
  constructor(payload?: Object | string, description = `I'm a teapot`) {
    super(
      HttpException.createPayload(payload, description, HttpStatus.I_AM_A_TEAPOT),
      HttpStatus.I_AM_A_TEAPOT
    )
  }
}
