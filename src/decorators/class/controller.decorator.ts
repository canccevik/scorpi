import { ControllerOptions } from '../../interfaces'
import { TypeMetadataStorage } from '../../storages'

export function Controller(name = '/'): ClassDecorator {
  return (target: object): void => {
    const options: ControllerOptions = { name }

    TypeMetadataStorage.addControllerMetadata({
      target,
      options
    })
  }
}
