import { Type } from '../interfaces'
import { ControllerMetadata, MiddlewareMetadata } from '../metadata'

class TypeMetadataStorageHost {
  private controllers = new Array<ControllerMetadata>()
  private middlewares = new Array<MiddlewareMetadata>()

  public addControllerMetadata(metadata: ControllerMetadata): void {
    this.controllers.unshift(metadata)
  }

  public getControllerMetadataByTarget(target: Type): ControllerMetadata | undefined {
    return this.controllers.find((metadata) => metadata.target === target)
  }

  public addMiddlewareMetadata(metadata: MiddlewareMetadata): void {
    this.middlewares.unshift(metadata)
  }

  public getMiddlewaresMetadataByPredicate(
    belongsToTarget: (item: MiddlewareMetadata) => boolean
  ): MiddlewareMetadata[] | undefined {
    return this.middlewares.filter(belongsToTarget)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
