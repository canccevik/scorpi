import { Container } from 'magnodi'
import e, { RequestHandler, Router, Request, Response, NextFunction } from 'express'

import { AdapterOptions, Middleware, Type, ScorpiExceptionHandler } from '../../interfaces'
import { HttpAdapter } from '../http.adapter'
import { TypeMetadataStorage } from '../../storages'
import { ExpressMiddleware } from './express-middleware.interface'
import { HttpException, InternalServerErrorException } from '../../exceptions'

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

  public registerControllers(controllers: Type[]): void {
    controllers.forEach((controller) => {
      const controllerMetadata = TypeMetadataStorage.getControllerMetadataByTarget(controller)!
      Container.provide(controller, controller)

      const controllerInstance = Container.resolve(controller)
      const router = this.createRouterAndRegisterActions(controller, controllerInstance)

      const controllerMiddlewares =
        (TypeMetadataStorage.getMiddlewaresMetadataByPredicate(
          (metadata) => metadata.target === controller
        )?.map((metadata) => metadata.value) as RequestHandler[]) || []

      const controllerPath = this.globalPrefix + controllerMetadata.options.name
      this.app.use(controllerPath, ...controllerMiddlewares, router)
    })
  }

  private createRouterAndRegisterActions(controller: Type, controllerInstance: unknown): e.Router {
    const actionsMetadata = TypeMetadataStorage.getActionsMetadataByPredicate(
      (metadata) => metadata.target === controller
    )
    const router = new this.Router()

    actionsMetadata?.forEach(({ value, action }) => {
      const actionMiddlewares =
        (TypeMetadataStorage.getMiddlewaresMetadataByPredicate(
          (metadata) => metadata.target === value
        )?.map((metadata) => metadata.value) as RequestHandler[]) || []

      const actionWrapper = (req: Request, res: Response): void => {
        try {
          const response = value.bind(controllerInstance)(req, res)
          response && res.send(response)
        } catch (error) {
          this.handleError(error, req, res)
        }
      }

      router[action.method](action.name, ...actionMiddlewares, actionWrapper)
    })
    return router
  }

  public registerGlobalMiddlewares(middlewares: Middleware[]): void {
    middlewares.forEach((middleware) => {
      if (typeof middleware.prototype.use === 'function') {
        const middlewareInstance = Container.resolve<ExpressMiddleware>(
          middleware as Type<ExpressMiddleware>
        )
        return this.app.use(middlewareInstance.use.bind(middlewareInstance))
      }
      this.app.use(middleware as RequestHandler)
    })
  }

  protected handleError(err: any, req: Request, res: Response): void {
    const error = err.payload ? (err as HttpException) : new InternalServerErrorException()

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
}