export abstract class HttpAdapter<App = unknown> {
  protected app!: App

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>

  public abstract listen(port: number): Promise<void>
}
