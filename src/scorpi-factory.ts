import { Type } from '@interfaces/index'
import { HttpAdapter } from '@adapters/index'

import { ScorpiApplication } from './scorpi-application'

export class ScorpiFactory {
  public static async create(adapter: Type<HttpAdapter>): Promise<ScorpiApplication> {
    const adapterInstance = new adapter()
    const initializedAdapter = await adapterInstance.initialize()

    return new ScorpiApplication(initializedAdapter)
  }
}
