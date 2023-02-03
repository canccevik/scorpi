import { Type } from '@interfaces/index'
import { ControllerMetadata } from '@metadata/index'

class TypeMetadataStorageHost {
  private controllers = new Array<ControllerMetadata>()

  public addController(metadata: ControllerMetadata): void {
    this.controllers.unshift(metadata)
  }

  public getControllerMetadataByTarget(target: Type): ControllerMetadata | undefined {
    return this.controllers.find((metadata) => metadata.target === target)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
