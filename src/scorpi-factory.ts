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
    const adapterOptions: AdapterOptions = {
      globalPrefix: options.globalPrefix,
      exceptionHandler: options.exceptionHandler
    }

    const adapterInstance = new adapter(adapterOptions)
    const initializedAdapter = await adapterInstance.initialize()

    return new ScorpiApplication(initializedAdapter, options)
  }
}
