import { Action, ParamType } from '../metadata'
import { Middleware, ScorpiExceptionHandler, Type } from '../interfaces'

export interface AdapterOptions {
  globalPrefix?: string
  exceptionHandler?: Type<ScorpiExceptionHandler>
}

export abstract class HttpAdapter<App = unknown, Request = unknown, Response = unknown> {
  protected app!: App
  protected globalPrefix: string

  constructor(adapterOptions: AdapterOptions) {
    this.globalPrefix = adapterOptions.globalPrefix || ''
  }

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>

  public abstract listen(port: number): Promise<void>
  public abstract registerErrorHandler(): void
  public abstract registerGlobalMiddlewares(middlewares: Middleware[] | string): Promise<void>
  public abstract registerControllers(controllers: Type[] | string): Promise<void>
  protected abstract handleError(err: any, req: Request, res: Response): Promise<void>
  protected abstract handleSuccess(req: Request, res: Response, action: Action): void
  protected abstract getParamFromRequest(req: Request, res: Response, paramType: ParamType): any
}
