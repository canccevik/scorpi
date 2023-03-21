import { HttpException } from '../exceptions'

export interface ScorpiExceptionHandler<Request = unknown, Response = unknown> {
  catch(exception: HttpException, req: Request, res: Response): void
}
