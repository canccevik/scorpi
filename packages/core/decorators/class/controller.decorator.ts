import { TypeMetadataStorage } from '../../storages'

export interface ControllerOptions {
  name: string
}

export function Controller(name = '/'): ClassDecorator {
  return (target: object): void => {
    const options: ControllerOptions = { name }

    TypeMetadataStorage.addControllerMetadata({
      target,
      options
    })
  }
}
