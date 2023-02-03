import { ControllerOptions } from '@interfaces/index'
import { TypeMetadataStorage } from '@storages/index'

export function Controller(options: ControllerOptions): ClassDecorator {
  return (target: object): void => {
    TypeMetadataStorage.addControllerMetadata({
      target,
      options
    })
  }
}
