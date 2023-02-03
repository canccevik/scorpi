import { Type } from '../interfaces'
import { ActionMetadata, ControllerMetadata } from '../metadata'

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

  public getActionsMetadataByPredicate(
    belongsToClass: (item: ActionMetadata) => boolean
  ): ActionMetadata[] | undefined {
    return this.actions.filter(belongsToClass)
  }
}

export const TypeMetadataStorage = new TypeMetadataStorageHost()
