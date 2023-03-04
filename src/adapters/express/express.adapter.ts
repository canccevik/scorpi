import { Container } from 'magnodi'
import e, { RequestHandler, Router, Request, Response, NextFunction } from 'express'

import { Middleware, Type, ScorpiExceptionHandler } from '../../interfaces'
import { AdapterOptions, HttpAdapter } from '../http.adapter'
import { ActionStorage, TypeMetadataStorage } from '../../storages'
import { ExpressMiddleware } from './express-middleware.interface'
import { HttpException, InternalServerErrorException } from '../../exceptions'
import { Action } from '../../metadata'

export class ExpressAdapter extends HttpAdapter<e.Application, Request, Response> {
  private express!: typeof e
  private Router!: Type<Router>

  constructor(private readonly options: AdapterOptions) {
    super(options)
  }

  public async initialize(): Promise<this> {
    await this.loadAdapter()
    this.app = this.express()
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

  public async listen(port: number): Promise<void> {
    await this.app.listen(port)
  }

  public registerControllers(controllers: Type[]): this {
    controllers.forEach((controller) => {
      const controllerMetadata = TypeMetadataStorage.getControllerMetadataByTarget(controller)!
      Container.provide(controller, controller)

      const controllerInstance = Container.resolve(controller)
      const router = this.createRouterAndRegisterActions(controller, controllerInstance)

      const controllerMiddlewaresMetadata = TypeMetadataStorage.getMiddlewaresMetadataByPredicate(
        (metadata) => metadata.target === controller
      )
      const controllerMiddlewares = controllerMiddlewaresMetadata?.map((metadata) => metadata.value)

      const controllerPath = this.globalPrefix + controllerMetadata.options.name
      this.app.use(controllerPath, ...[controllerMiddlewares as RequestHandler[]], router)
    })
    return this
  }

  private createRouterAndRegisterActions(controller: Type, controllerInstance: unknown): e.Router {
    const actionsMetadata = ActionStorage.getActionsMetadataByPredicate(
      (metadata) => metadata.target === controller
    )
    const router = new this.Router()

    actionsMetadata?.forEach(({ value, action }) => {
      const actionMiddlewaresMetadata = TypeMetadataStorage.getMiddlewaresMetadataByPredicate(
        (metadata) => metadata.target === value
      )
      const actionMiddlewares = actionMiddlewaresMetadata?.map((metadata) => metadata.value) || []

      const actionWrapper = async (req: Request, res: Response): Promise<void> => {
        try {
          this.handleSuccess(req, res, action)
          const response = await value.bind(controllerInstance)(req, res)
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

  public registerGlobalMiddlewares(middlewares: Middleware[]): this {
    middlewares.forEach((middleware) => {
      if (typeof middleware.prototype.use === 'function') {
        const middlewareInstance = Container.resolve<ExpressMiddleware>(
          middleware as Type<ExpressMiddleware>
        )
        return this.app.use(middlewareInstance.use.bind(middlewareInstance))
      }
      this.app.use(middleware as RequestHandler)
    })
    return this
  }

  protected async handleError(err: any, req: Request, res: Response): Promise<void> {
    const error = err.payload ? (err as HttpException) : new InternalServerErrorException()
    err.payload && console.error(err)

    const exceptionHandler = this.options.exceptionHandler

    if (exceptionHandler) {
      const exceptionHandlerInstance = Container.resolve<ScorpiExceptionHandler>(exceptionHandler)
      return exceptionHandlerInstance.catch(error, req, res)
    }
    res.status(error.statusCode).json(error.payload)
  }

  public registerErrorHandler(): this {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.handleError(err, req, res)
    })
    return this
  }

  protected handleSuccess(req: Request, res: Response, action: Action): void {
    action.statusCode && res.status(action.statusCode)
    action.redirectUrl && res.redirect(action.redirectUrl)
    action.contentType && res.contentType(action.contentType)
  }
}
