import multer from 'multer'
import cookie from 'cookie'
import e, { RequestHandler, Router, Request, Response, NextFunction } from 'express'

import { IncomingHttpHeaders } from 'http'

import { Middleware, Type } from '../../interfaces'
import { AdapterOptions, HttpAdapter } from '../http.adapter'
import { Action, Header } from '../../metadata'
import { HttpStatus } from '../../enums'

export class ExpressAdapter extends HttpAdapter<e.Application, Request, Response, RequestHandler> {
  private express!: typeof e
  private Router!: Type<Router>

  constructor(private readonly options: AdapterOptions) {
    super(options)
  }

  protected async loadAdapter(): Promise<void> {
    try {
      const { default: express, Router: ExpressRouter } = await import('express')
      this.express = express
      this.Router = ExpressRouter as unknown as Type<Router>
      this.app = this.express()
      this.app.use(this.express.json())
    } catch (error) {
      throw new Error('Express package not found. Try to install it: npm install express')
    }
  }

  protected async loadCors(): Promise<void> {
    const corsOptions = typeof this.options.cors !== 'boolean' ? this.options.cors : {}
    try {
      const { default: cors } = await import('cors')
      this.app.use(cors(corsOptions))
    } catch (error) {
      throw new Error('Cors package not found. Try to install it: npm install cors')
    }
  }

  protected async setViewEngine(): Promise<void> {
    const { name, views } = this.options.viewEngine!
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = await import(name)
      this.app.set('view engine', name)
      this.app.set('views', views)
    } catch (error) {
      throw new Error(`${name} package not found. Try to install it: npm install ${name}`)
    }
  }

  public registerErrorHandler(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.handleError(err, req, res)
    })
  }

  protected registerAction(
    router: any,
    action: Action,
    middlewares: Middleware[],
    handler: RequestHandler
  ): void {
    router[action.method!](action.name, ...middlewares, handler)
  }

  protected getSingleFileUploadMiddleware(options: any, propertyName: string): Middleware {
    return multer(options).single(propertyName)
  }

  protected getMultiFileUploadMiddleware(options: any, propertyName: string): Middleware {
    return multer(options).array(propertyName)
  }

  protected createRouter(): any {
    return new this.Router()
  }

  public async listen(port: number): Promise<void> {
    await this.app.listen(port)
  }

  protected addRequestHandler(path: string | RegExp, ...handlers: RequestHandler[]): void {
    this.app.use(path, ...handlers)
  }

  protected addMiddleware(...middlewares: Middleware[]): void {
    this.app.use(...(middlewares as RequestHandler[]))
  }

  protected send(res: Response, payload: any): void {
    res.send(payload)
  }

  protected sendWithStatus(res: Response, payload: any, statusCode: HttpStatus): void {
    res.status(statusCode).json(payload)
  }

  protected setStatusCode(res: Response, statusCode: number): void {
    res.status(statusCode)
  }

  protected setRedirectUrl(res: Response, redirectUrl: string): void {
    res.redirect(redirectUrl)
  }

  protected setHeaders(res: Response, headers: Header[]): void {
    headers.forEach((header) => res.setHeader(header.key, header.value))
  }

  protected setContentType(res: Response, contentType: string): void {
    res.contentType(contentType)
  }

  protected setLocationUrl(res: Response, locationUrl: string): void {
    res.location(locationUrl)
  }

  protected renderView(res: Response, view: string, data: any): void {
    res.render(view, data)
  }

  protected getBodyFromRequest(req: Request): unknown {
    return req.body
  }

  protected getCookiesFromRequest(req: Request): Record<string, string> {
    return cookie.parse(req.headers.cookie ?? '')
  }

  protected getHeadersFromRequest(req: Request): IncomingHttpHeaders {
    return req.headers
  }

  protected getHostNameFromRequest(req: Request): string {
    return req.hostname
  }

  protected getIpFromRequest(req: Request): string {
    return req.ip
  }

  protected getParamsFromRequest(req: Request): any {
    return req.params
  }

  protected getQueryFromRequest(req: Request): unknown {
    return req.query
  }

  protected getSessionFromRequest(req: Request): unknown {
    return (req as any).session
  }

  protected getFileFromRequest(req: Request): unknown {
    return req.file
  }

  protected getFilesFromRequest(req: Request): unknown {
    return req.files
  }
}
