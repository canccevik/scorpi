import { AdapterOptions, Type } from '../interfaces'

export abstract class HttpAdapter<App = unknown> {
  protected app!: App
  protected globalPrefix: string

  constructor(adapterOptions: AdapterOptions) {
    this.globalPrefix = adapterOptions.globalPrefix || ''
  }

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>

  public abstract listen(port: number): Promise<void>
  public abstract registerControllers(controllers: Type[]): void
}
