import { AdapterOptions, ScorpiOptions, Type } from './interfaces'
import { HttpAdapter } from './adapters'
import { ScorpiApplication } from './scorpi-application'

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
