import { HttpAdapter } from '@adapters/index'

export class ScorpiApplication {
  constructor(private readonly adapter: HttpAdapter) {}

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port)
  }
}
