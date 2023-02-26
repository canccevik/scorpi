import { ActionMetadata } from '../metadata'

class ActionStorageHost {
  private actions = new Array<ActionMetadata>()

  public addActionMetadata(metadata: ActionMetadata): void {
    this.actions.unshift(metadata)
  }

  public getActionsMetadataByPredicate(
    belongsToTarget: (item: ActionMetadata) => boolean
  ): ActionMetadata[] | undefined {
    return this.actions.filter(belongsToTarget)
  }
}

export const ActionStorage = new ActionStorageHost()
