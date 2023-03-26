import { Server } from 'http'

import { HttpAdapter } from './adapters'
import { ScorpiOptions } from './scorpi-factory'

export class ScorpiApplication {
  constructor(private readonly adapter: HttpAdapter, private readonly options: ScorpiOptions) {
    this.adapter.registerGlobalMiddlewares(this.options.middlewares || [])
    this.adapter.registerControllers(this.options.controllers)
    this.adapter.registerErrorHandler()
  }

  public async listen(port: number): Promise<Server> {
    return this.adapter.listen(port)
  }

  public getApp(): any {
    return this.adapter.getApp()
  }
}
