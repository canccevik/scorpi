import { Middleware, Type } from '../interfaces'
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

  public getMiddlewaresByTarget(target: Type | Function): Middleware[] {
    const middlewaresMetadata = this.middlewares.filter((item) => item.target === target)
    return middlewaresMetadata.map((metadata) => metadata.value) || []
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
