import { Type } from '@interfaces/index'
import { ActionMetadata, ControllerMetadata } from '@metadata/index'

class TypeMetadataStorageHost {
  private controllers = new Array<ControllerMetadata>()
  private actions = new Array<ActionMetadata>()

  public addControllerMetadata(metadata: ControllerMetadata): void {
    this.controllers.unshift(metadata)
  }

  public getControllerMetadataByTarget(target: Type): ControllerMetadata | undefined {
    return this.controllers.find((metadata) => metadata.target === target)
  }

  public addActionMetadata(metadata: ActionMetadata): void {
    this.actions.unshift(metadata)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
