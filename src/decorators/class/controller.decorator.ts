import { ControllerOptions } from '../../interfaces'
import { TypeMetadataStorage } from '../../storages'

export function Controller(options: ControllerOptions): ClassDecorator {
  return (target: object): void => {
    TypeMetadataStorage.addControllerMetadata({
      target,
      options
    })
  }
}
