import { CorsOptions } from 'cors'
import { validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { Action, ParamType } from '../metadata'
import { Middleware, ScorpiExceptionHandler, Type } from '../interfaces'
import { BadRequestException } from '../exceptions'

export interface AdapterOptions {
  globalPrefix?: string
  exceptionHandler?: Type<ScorpiExceptionHandler>
  useValidation?: boolean
  useClassTransformer?: boolean
  cors?: boolean | CorsOptions
}

export interface ParamFilter {
  paramType: ParamType
  propertyName?: string
}

export abstract class HttpAdapter<App = unknown, Request = unknown, Response = unknown> {
  protected app!: App
  protected globalPrefix: string

  constructor(private adapterOptions: AdapterOptions) {
    this.globalPrefix = adapterOptions.globalPrefix || ''
    this.adapterOptions.useValidation = this.adapterOptions.useValidation ?? true
    this.adapterOptions.useClassTransformer = this.adapterOptions.useClassTransformer ?? true
  }

  public abstract initialize(): Promise<this>
  protected abstract loadAdapter(): Promise<void>
  protected abstract loadCors(): Promise<void>

  public abstract listen(port: number): Promise<void>
  public abstract registerErrorHandler(): void
  public abstract registerGlobalMiddlewares(middlewares: Middleware[] | string): Promise<void>
  public abstract registerControllers(controllers: Type[] | string): Promise<void>
  protected abstract handleError(err: any, req: Request, res: Response): Promise<void>
  protected abstract handleSuccess(req: Request, res: Response, action: Action): void
  protected abstract getParamFromRequest(req: Request, res: Response, filter: ParamFilter): any

  protected transformResult(type: any, value: unknown, useValidator = false): any {
    if (!useValidator || !this.adapterOptions.useValidation) return value

    const instance: any = plainToInstance(type, value)

    if (!(instance instanceof type)) return value

    const errors = validateSync(instance, { validationError: { target: false } })

    if (errors.length) {
      const payload = this.adapterOptions.exceptionHandler ? errors : { errors }
      throw new BadRequestException(payload)
    }
    return this.adapterOptions.useClassTransformer ? instance : value
  }
}
