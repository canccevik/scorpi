export abstract class HttpAdapter<App> {
  protected app!: App

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>
}
