import { HttpAdapter } from './adapters'
import { ScorpiOptions } from './interfaces'

export class ScorpiApplication {
  constructor(private readonly adapter: HttpAdapter, private readonly options: ScorpiOptions) {
    if (this.options.middlewares) {
      this.adapter.registerGlobalMiddlewares(this.options.middlewares)
    }
    this.adapter.registerControllers(this.options.controllers)
  }

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port)
  }
}
