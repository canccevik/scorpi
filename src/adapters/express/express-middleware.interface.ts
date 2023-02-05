import { NextFunction, Request, Response } from 'express'

export interface ExpressMiddleware {
  use(req: Request, res: Response, next: NextFunction): void
}
