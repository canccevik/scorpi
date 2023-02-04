import { Type } from '../interfaces'
import { ActionMetadata, ControllerMetadata, MiddlewareMetadata } from '../metadata'

class TypeMetadataStorageHost {
  private controllers = new Array<ControllerMetadata>()
  private actions = new Array<ActionMetadata>()
  public middlewares = new Array<MiddlewareMetadata>()

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
    belongsToTarget: (item: ActionMetadata) => boolean
  ): ActionMetadata[] | undefined {
    return this.actions.filter(belongsToTarget)
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
