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
  public abstract registerGlobalMiddlewares(middlewares: Middleware[]): this
  public abstract registerControllers(controllers: Type[]): this
  protected abstract handleError(err: any, req: Request, res: Response): Promise<void>
  public abstract registerErrorHandler(): this
}
