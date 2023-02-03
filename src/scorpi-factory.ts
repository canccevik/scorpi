import { ScorpiOptions, Type } from './interfaces'
import { HttpAdapter } from './adapters'
import { ScorpiApplication } from './scorpi-application'

export class ScorpiFactory {
  public static async create(
    adapter: Type<HttpAdapter>,
    options: ScorpiOptions
  ): Promise<ScorpiApplication> {
    const adapterInstance = new adapter()
    const initializedAdapter = await adapterInstance.initialize()

    return new ScorpiApplication(initializedAdapter, options)
  }
}
