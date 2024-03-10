export interface ScorpiMiddleware<Request = unknown, Response = unknown, NextFunction = unknown> {
  use(req: Request, res: Response, next: NextFunction): void
}
