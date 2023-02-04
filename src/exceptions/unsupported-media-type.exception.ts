import { HttpStatus } from '../enums'
import { HttpException } from './http.exception'

export class UnsupportedMediaTypeException extends HttpException {
  constructor(payload?: Object | string, description = 'Unsupported Media Type') {
    super(
      HttpException.createPayload(payload, description, HttpStatus.UNSUPPORTED_MEDIA_TYPE),
      HttpStatus.UNSUPPORTED_MEDIA_TYPE
    )
  }
}
