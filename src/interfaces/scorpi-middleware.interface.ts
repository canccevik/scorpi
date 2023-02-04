export interface ScorpiMiddleware {
  use(req: any, res: any, next: any): void
}
