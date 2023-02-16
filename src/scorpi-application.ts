import { HttpAdapter } from './adapters'
import { ScorpiOptions } from './interfaces'

export class ScorpiApplication {
  constructor(private readonly adapter: HttpAdapter, private readonly options: ScorpiOptions) {
    this.adapter
      .registerGlobalMiddlewares(this.options.middlewares || [])
      .registerControllers(this.options.controllers)
      .registerErrorHandler()
  }

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port)
  }
}
