import { ActionMetadata } from '../metadata'

class ActionStorageHost {
  private actions = new Array<ActionMetadata>()

  public addActionMetadata(metadata: ActionMetadata): void {
    const metadataIndex = this.actions.findIndex(
      (action) => action.target === metadata.target && action.value === metadata.value
    )

    if (metadataIndex === -1) {
      this.actions.unshift(metadata)
      return
    }

    const action = this.actions[metadataIndex].action
    this.actions[metadataIndex].action = { ...action, ...metadata.action }
  }

  public getActionsMetadataByPredicate(
    belongsToTarget: (item: ActionMetadata) => boolean
  ): ActionMetadata[] | undefined {
    return this.actions.filter(belongsToTarget)
  }
}

export const ActionStorage = new ActionStorageHost()
