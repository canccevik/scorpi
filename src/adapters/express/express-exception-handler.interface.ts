import { Request, Response } from 'express'

import { HttpException } from '../../exceptions'

export interface ExpressExceptionHandler {
  catch(exception: HttpException, req: Request, res: Response): void
}
