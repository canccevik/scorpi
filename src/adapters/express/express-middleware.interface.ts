import { NextFunction, Request, Response } from 'express'

export interface ExpressMiddleware {
  use(req: Request<any>, res: Response<any>, next: NextFunction): void
}
