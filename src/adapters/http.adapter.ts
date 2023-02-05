import { AdapterOptions, Middleware, Type } from '../interfaces'

export abstract class HttpAdapter<App = unknown, Request = unknown, Response = unknown> {
  protected app!: App
  protected globalPrefix: string

  constructor(adapterOptions: AdapterOptions) {
    this.globalPrefix = adapterOptions.globalPrefix || ''
  }

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>

  public abstract listen(port: number): Promise<void>
  public abstract registerControllers(controllers: Type[]): void
  public abstract registerGlobalMiddlewares(middlewares: Middleware[]): void
  protected abstract handleError(err: any, req: Request, res: Response): void
  public abstract registerErrorHandler(): void
}
