import { ParamMetadata } from '../metadata'

class ParamStorageHost {
  private params = new Array<ParamMetadata>()

  public addParamMetadata(metadata: ParamMetadata): void {
    this.params.unshift(metadata)
  }

  public getParamsMetadataByPredicate(
    belongsToTarget: (item: ParamMetadata) => boolean
  ): ParamMetadata[] | undefined {
    return this.params.filter(belongsToTarget).sort((a, b) => b.index - a.index)
  }
}

export const ParamStorage = new ParamStorageHost()
