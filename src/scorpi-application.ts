import { HttpAdapter } from './adapters'
import { ScorpiOptions } from './scorpi-factory'

export class ScorpiApplication {
  constructor(private readonly adapter: HttpAdapter, private readonly options: ScorpiOptions) {
    this.adapter.registerGlobalMiddlewares(this.options.middlewares || [])
    this.adapter.registerControllers(this.options.controllers)
    this.adapter.registerErrorHandler()
  }

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port)
  }
}
