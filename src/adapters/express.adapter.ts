import e, { Router } from 'express'
import { Container } from 'magnodi'

import { Type } from '../interfaces'
import { HttpAdapter } from './http.adapter'
import { TypeMetadataStorage } from '../storages'

export class ExpressAdapter extends HttpAdapter<e.Application> {
  private express!: typeof e
  private Router!: Type<Router>

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

      this.app.use(controllerMetadata.options.name, router)
    })
  }

  private createRouterAndRegisterActions(controller: Type, controllerInstance: unknown): e.Router {
    const actionsMetadata = TypeMetadataStorage.getActionsMetadataByPredicate(
      (metadata) => metadata.target === controller
    )
    const router = new this.Router()

    actionsMetadata?.forEach(({ value, action }) => {
      router[action.method](action.name, value.bind(controllerInstance))
    })
    return router
  }
}
