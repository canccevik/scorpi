import { ParamMetadata } from '../metadata'

class ParamStorageHost {
  private params = new Array<ParamMetadata>()

  public addParamMetadata(metadata: ParamMetadata): void {
    this.params.unshift(metadata)
  }

  public getParamsMetadata(target: object, value: Function): ParamMetadata[] {
    return this.params
      .filter((metadata) => metadata.target === target && metadata.value === value)
      .sort((a, b) => a.index - b.index)
  }
}

export const ParamStorage = new ParamStorageHost()
