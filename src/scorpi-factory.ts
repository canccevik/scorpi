import { Middleware, Type } from './interfaces'
import { AdapterOptions, HttpAdapter } from './adapters'
import { ScorpiApplication } from './scorpi-application'

export interface ScorpiOptions extends AdapterOptions {
  controllers: Type[] | string
  middlewares?: Middleware[] | string
}

export class ScorpiFactory {
  public static async create(
    adapter: Type<HttpAdapter>,
    options: ScorpiOptions
  ): Promise<ScorpiApplication> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { controllers, middlewares, ...adapterOptions } = options

    const adapterInstance = new adapter(adapterOptions)
    const initializedAdapter = await adapterInstance.initialize()

    return new ScorpiApplication(initializedAdapter, options)
  }
}
