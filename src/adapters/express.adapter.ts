import e, { RequestHandler, Router } from 'express'
import { Container } from 'magnodi'

import { AdapterOptions, Middleware, Type } from '../interfaces'
import { HttpAdapter } from './http.adapter'
import { TypeMetadataStorage } from '../storages'

export class ExpressAdapter extends HttpAdapter<e.Application> {
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

      router[action.method](action.name, ...actionMiddlewares, value.bind(controllerInstance))
    })
    return router
  }

  public registerGlobalMiddlewares(middlewares: Middleware[]): void {
    middlewares.forEach((middleware) => this.app.use(<RequestHandler>middleware))
  }
}
