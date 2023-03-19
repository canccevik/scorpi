import multer from 'multer'
import cookie from 'cookie'
import { Container } from 'magnodi'
import e, { RequestHandler, Router, Request, Response, NextFunction } from 'express'

import { Middleware, Type, ScorpiExceptionHandler } from '../../interfaces'
import { AdapterOptions, HttpAdapter, ParamFilter } from '../http.adapter'
import { ActionStorage, ParamStorage, TypeMetadataStorage } from '../../storages'
import { ExpressMiddleware } from './express-middleware.interface'
import { HttpException, InternalServerErrorException } from '../../exceptions'
import { Action } from '../../metadata'
import { getClassesBySuffix } from '../../utils'

export class ExpressAdapter extends HttpAdapter<e.Application, Request, Response> {
  private express!: typeof e
  private Router!: Type<Router>

  constructor(private readonly options: AdapterOptions) {
    super(options)
  }

  public async initialize(): Promise<this> {
    await this.loadAdapter()
    this.app = this.express()
    this.app.use(this.express.json())
    await this.loadCors()
    return this
  }

  protected async loadAdapter(): Promise<void> {
    try {
      const { default: express, Router: ExpressRouter } = await import('express')
      this.express = express
      this.Router = ExpressRouter as unknown as Type<Router>
    } catch (error) {
      throw new Error('Express package not found. Try to install it: npm install express')
    }
  }

  protected async loadCors(): Promise<void> {
    if (!this.options.cors) return

    const corsOptions = this.options.cors !== true ? this.options.cors : {}

    try {
      const { default: cors } = await import('cors')
      this.app.use(cors(corsOptions))
    } catch (error) {
      throw new Error('Cors package not found. Try to install it: npm install cors')
    }
  }

  public async listen(port: number): Promise<void> {
    await this.app.listen(port)
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
      const router = this.createRouterAndRegisterActions(controller, controllerInstance)

      const controllerPath = this.globalPrefix + controllerMetadata?.options.name
      this.app.use(controllerPath, ...(controllerMiddlewares as RequestHandler[]), router)
    })
  }

  private createRouterAndRegisterActions(controller: Type, controllerInstance: unknown): e.Router {
    const router = new this.Router()
    const actionsMetadata = ActionStorage.getActionsMetadataByTarget(controller)

    actionsMetadata.forEach(({ value, action }) => {
      const actionMiddlewares = TypeMetadataStorage.getMiddlewaresByTarget(value)
      const paramsMetadata = ParamStorage.getParamsMetadata(controller, value)

      paramsMetadata.forEach((param) => {
        if (param.propertyName) {
          if (param.paramType === 'file') {
            actionMiddlewares.push(multer(param.options).single(param.propertyName))
          } else if (param.paramType === 'files') {
            actionMiddlewares.push(multer(param.options).array(param.propertyName))
          }
        }
      })

      const actionWrapper = async (req: Request, res: Response): Promise<void> => {
        try {
          const actionParams = paramsMetadata.map((param) => {
            const paramValue = this.getParamFromRequest(req, res, {
              paramType: param.paramType,
              propertyName: param.propertyName
            })
            return this.transformResult(param.type, paramValue, param.useValidator)
          })

          this.handleSuccess(req, res, action)
          const response = await value.bind(controllerInstance)(...actionParams)
          response && res.send(response)
        } catch (error) {
          this.handleError(error, req, res)
        }
      }

      if (!action.method || !action.name) return
      router[action.method](action.name, ...[actionMiddlewares as RequestHandler[]], actionWrapper)
    })
    return router
  }

  public async registerGlobalMiddlewares(middlewares: Middleware[]): Promise<void> {
    if (typeof middlewares === 'string') {
      middlewares = await getClassesBySuffix(middlewares)
    }

    middlewares.forEach((middleware) => {
      if (middleware.prototype.use) {
        const middlewareInstance = Container.resolve<ExpressMiddleware>(middleware as Type)
        return this.app.use(middlewareInstance.use.bind(middlewareInstance))
      }
      this.app.use(middleware as RequestHandler)
    })
  }

  protected async handleError(err: any, req: Request, res: Response): Promise<void> {
    const error = err.payload ? (err as HttpException) : new InternalServerErrorException()
    !err.payload && console.error(err)

    const exceptionHandler = this.options.exceptionHandler

    if (exceptionHandler) {
      const exceptionHandlerInstance = Container.resolve<ScorpiExceptionHandler>(exceptionHandler)
      return exceptionHandlerInstance.catch(error, req, res)
    }
    res.status(error.statusCode).json(error.payload)
  }

  public registerErrorHandler(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.handleError(err, req, res)
    })
  }

  protected handleSuccess(req: Request, res: Response, action: Action): void {
    action.statusCode && res.status(action.statusCode)
    action.headers && action.headers.forEach(({ key, value }) => res.header(key, value))
    action.redirectUrl && res.redirect(action.redirectUrl)
    action.contentType && res.contentType(action.contentType)
    action.locationUrl && res.location(action.locationUrl)
  }

  protected getParamFromRequest(req: Request, res: Response, filter: ParamFilter): any {
    const param = ((): any => {
      switch (filter.paramType) {
        case 'req':
          return req
        case 'res':
          return res
        case 'body':
          return req.body
        case 'cookies':
          return cookie.parse(req.headers.cookie ?? '')
        case 'headers':
          return req.headers
        case 'hosts':
          return req.hostname
        case 'ip':
          return req.ip
        case 'params':
          return req.params
        case 'query':
          return req.query
        case 'session':
          return (req as any).session
        case 'file':
          return req.file
        case 'files':
          return req.files
      }
    })()

    return filter.propertyName && filter.paramType !== 'file' && filter.paramType !== 'files'
      ? param[filter.propertyName]
      : param
  }
}
