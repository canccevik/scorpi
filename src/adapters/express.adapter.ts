import e, { Router } from 'express'

import { HttpAdapter } from './http.adapter'

export class ExpressAdapter extends HttpAdapter<e.Application> {
  private express!: typeof e
  private router!: Router

  public async initialize(): Promise<this> {
    await this.loadAdapter()
    this.app = this.express()
    return this
  }

  protected async loadAdapter(): Promise<void> {
    try {
      const { default: express, Router } = await import('express')
      this.express = express
      this.router = Router()
    } catch (error) {
      throw new Error('Express package not found. Try to install it: npm install express')
    }
  }
}
