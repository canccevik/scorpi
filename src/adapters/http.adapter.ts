import { Container } from 'magnodi'
import { CorsOptions } from 'cors'
import { validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'

import { IncomingHttpHeaders, Server } from 'http'

import { Action, Header, ParamMetadata, ParamType } from '../metadata'
import { Middleware, ScorpiExceptionHandler, ScorpiMiddleware, Type } from '../interfaces'
import { BadRequestException, HttpException, InternalServerErrorException } from '../exceptions'
import { getClassesBySuffix } from '../utils'
import { ActionStorage, ParamStorage, TypeMetadataStorage } from '../storages'
import { HttpStatus } from '../enums'

export interface AdapterOptions {
  globalPrefix?: string
  exceptionHandler?: Type<ScorpiExceptionHandler>
  useValidation?: boolean
  useClassTransformer?: boolean
  cors?: boolean | CorsOptions
  viewEngine?: ViewEngineOptions
}

export interface ViewEngineOptions {
  name: string
  views: string
}

export interface ParamFilter {
  paramType: ParamType
  propertyName?: string
}

export abstract class HttpAdapter<
  App = unknown,
  Request = unknown,
  Response = unknown,
  RequestHandler = unknown
> {
  protected app!: App
  protected globalPrefix: string

  constructor(private adapterOptions: AdapterOptions) {
    this.globalPrefix = adapterOptions.globalPrefix || ''
    this.adapterOptions.useValidation = this.adapterOptions.useValidation ?? true
    this.adapterOptions.useClassTransformer = this.adapterOptions.useClassTransformer ?? true
  }

  protected abstract loadAdapter(): Promise<void>
  protected abstract loadCors(): Promise<void>
  protected abstract setViewEngine(): Promise<void>
  public abstract registerErrorHandler(): void

  protected abstract getSingleFileUploadMiddleware(options: any, propertyName: string): Middleware
  protected abstract getMultiFileUploadMiddleware(options: any, propertyName: string): Middleware

  protected abstract registerAction(
    router: any,
    action: Action,
    middlewares: Middleware[],
    handler: RequestHandler
  ): void
  protected abstract createRouter(): any
  public abstract listen(port: number): Promise<Server>
  protected abstract addRequestHandler(path: string | RegExp, ...handlers: RequestHandler[]): void
  protected abstract addMiddleware(...middlewares: Middleware[]): void
  protected abstract send(res: Response, payload: any): void
  protected abstract sendWithStatus(res: Response, payload: any, statusCode: HttpStatus): void

  protected abstract setStatusCode(res: Response, statusCode: number): void
  protected abstract setRedirectUrl(res: Response, redirectUrl: string): void
  protected abstract setHeaders(res: Response, headers: Header[]): void
  protected abstract setContentType(res: Response, contentType: string): void
  protected abstract setLocationUrl(res: Response, locationUrl: string): void
  protected abstract renderView(res: Response, view: string, data: any): void

  protected abstract getBodyFromRequest(req: Request): unknown
  protected abstract getCookiesFromRequest(req: Request): Record<string, string>
  protected abstract getHeadersFromRequest(req: Request): IncomingHttpHeaders
  protected abstract getHostNameFromRequest(req: Request): string
  protected abstract getIpFromRequest(req: Request): string
  protected abstract getParamsFromRequest(req: Request): any
  protected abstract getQueryFromRequest(req: Request): unknown
  protected abstract getSessionFromRequest(req: Request): unknown
  protected abstract getFileFromRequest(req: Request): unknown
  protected abstract getFilesFromRequest(req: Request): unknown

  public getApp(): any {
    return this.app
  }

  public async initialize(): Promise<this> {
    await this.loadAdapter()

    if (this.adapterOptions.cors) {
      await this.loadCors()
    }
    if (this.adapterOptions.viewEngine) {
      await this.setViewEngine()
    }
    return this
  }

  public async registerControllers(controllers: Type[] | string): Promise<void> {
    if (typeof controllers === 'string') {
      controllers = await getClassesBySuffix(controllers)
    }

    controllers.forEach((controller) => {
      Container.provide(controller, controller)

      const controllerInstance = Container.resolve(controller)
      const controllerMetadata = TypeMetadataStorage.getControllerMetadataByTarget(controller)
      const controllerMiddlewares = TypeMetadataStorage.getMiddlewaresByTarget(controller)
      const controllerPath = this.globalPrefix + controllerMetadata?.options.name

      const router = this.createRouterAndRegisterActions(controller, controllerInstance)
      this.addRequestHandler(controllerPath, ...(controllerMiddlewares as RequestHandler[]), router)
    })
  }

  protected createRouterAndRegisterActions(controller: Type, controllerInstance: unknown): any {
    const router = this.createRouter()
    const actionsMetadata = ActionStorage.getActionsMetadataByTarget(controller)

    actionsMetadata.forEach(async ({ value, action }) => {
      const actionMiddlewares = TypeMetadataStorage.getMiddlewaresByTarget(value)
      const paramsMetadata = ParamStorage.getParamsMetadata(controller, value)

      this.addFileUploadMiddleware(paramsMetadata, actionMiddlewares)

      const actionWrapper = await this.getActionHandler(
        action,
        paramsMetadata,
        value,
        controllerInstance
      )

      if (!action.method || !action.name) return
      this.registerAction(router, action, actionMiddlewares, actionWrapper as RequestHandler)
    })
    return router
  }

  private addFileUploadMiddleware(params: ParamMetadata[], actionMiddlewares: Middleware[]): void {
    params.forEach((param) => {
      if (!param.propertyName) return

      if (param.paramType === 'file') {
        const middleware = this.getSingleFileUploadMiddleware(param.options, param.propertyName)
        actionMiddlewares.push(middleware)
      } else if (param.paramType === 'files') {
        const middleware = this.getMultiFileUploadMiddleware(param.options, param.propertyName)
        actionMiddlewares.push(middleware)
      }
    })
  }

  private async getActionHandler(
    action: Action,
    params: ParamMetadata[],
    value: Function,
    controllerInstance: unknown
  ): Promise<Function> {
    return async (req: Request, res: Response): Promise<void> => {
      try {
        const actionParams = this.getActionParams(req, res, params)
        const response = await value.bind(controllerInstance)(...actionParams)
        this.handleSuccess(res, action, response)
        response && !action.render && this.send(res, response)
      } catch (error) {
        this.handleError(error, req, res)
      }
    }
  }

  private getActionParams(req: Request, res: Response, params: ParamMetadata[]): any {
    return params.map((param) => {
      const paramValue = this.getParamFromRequest(req, res, {
        paramType: param.paramType,
        propertyName: param.propertyName
      })
      return this.transformResult(param.type, paramValue, param.useValidator)
    })
  }

  public async registerGlobalMiddlewares(middlewares: Middleware[] | string): Promise<void> {
    if (typeof middlewares === 'string') {
      middlewares = await getClassesBySuffix(middlewares)
    }

    middlewares.forEach((middleware) => {
      if (middleware.prototype.use) {
        const middlewareInstance = Container.resolve<ScorpiMiddleware>(middleware as Type)
        return this.addMiddleware(middlewareInstance.use.bind(middlewareInstance))
      }
      this.addMiddleware(middleware)
    })
  }

  protected async handleError(err: any, req: Request, res: Response): Promise<void> {
    const error = err.payload ? (err as HttpException) : new InternalServerErrorException()
    !err.payload && console.error(err)

    const exceptionHandler = this.adapterOptions.exceptionHandler

    if (exceptionHandler) {
      const exceptionHandlerInstance = Container.resolve<ScorpiExceptionHandler>(exceptionHandler)
      return exceptionHandlerInstance.catch(error, req, res)
    }
    this.sendWithStatus(res, error.payload, error.statusCode)
  }

  protected handleSuccess(res: Response, action: Action, data: object): void {
    action.statusCode && this.setStatusCode(res, action.statusCode)
    action.redirectUrl && this.setRedirectUrl(res, action.redirectUrl)
    action.headers && this.setHeaders(res, action.headers)
    action.contentType && this.setContentType(res, action.contentType)
    action.locationUrl && this.setLocationUrl(res, action.locationUrl)
    action.render && this.renderView(res, action.render, data)
  }

  protected getParamFromRequest(req: Request, res: Response, filter: ParamFilter): any {
    let param = null

    switch (filter.paramType) {
      case 'req':
        param = req
        break
      case 'res':
        param = res
        break
      case 'body':
        param = this.getBodyFromRequest(req)
        break
      case 'cookies':
        param = this.getCookiesFromRequest(req)
        break
      case 'headers':
        param = this.getHeadersFromRequest(req)
        break
      case 'hosts':
        param = this.getHostNameFromRequest(req)
        break
      case 'ip':
        param = this.getIpFromRequest(req)
        break
      case 'params':
        param = this.getParamsFromRequest(req)
        break
      case 'query':
        param = this.getQueryFromRequest(req)
        break
      case 'session':
        param = this.getSessionFromRequest(req)
        break
      case 'file':
        param = this.getFileFromRequest(req)
        break
      case 'files':
        param = this.getFilesFromRequest(req)
        break
    }

    return filter.propertyName && !['file', 'files'].includes(filter.paramType)
      ? param[filter.propertyName]
      : param
  }

  protected transformResult(type: any, value: unknown, useValidator = false): any {
    if (!useValidator || !this.adapterOptions.useValidation) return value

    const instance: any = plainToInstance(type, value)

    if (!(instance instanceof type)) return value

    const errors = validateSync(instance, {
      validationError: { target: false },
      forbidUnknownValues: false
    })

    if (errors.length) {
      const payload = this.adapterOptions.exceptionHandler ? errors : { errors }
      throw new BadRequestException(payload)
    }
    return this.adapterOptions.useClassTransformer ? instance : value
  }
}
