import { Lungo, Request, Response, IHandler, Router, fileUploader, INextFunc } from 'lungojs'

import { Server, IncomingHttpHeaders } from 'http'

import { HttpStatus } from '../../enums'
import { Middleware, Type } from '../../interfaces'
import { Action, Header } from '../../metadata'
import { AdapterOptions, HttpAdapter } from '../http.adapter'

export class LungoAdapter extends HttpAdapter<Lungo, Request, Response, IHandler, Router> {
  private Router!: Type<Router>

  constructor(private readonly options: AdapterOptions) {
    super(options)
  }

  protected async loadAdapter(): Promise<void> {
    try {
      const { Lungo, Router } = await import('lungojs')
      this.app = new Lungo()
      this.Router = Router as unknown as Type<Router>
    } catch (error) {
      throw new Error('Lungo package not found. Try to install it: npm install lungojs')
    }

    try {
      const { default: cookieParser } = await import('cookie-parser')
      this.app.use(cookieParser() as unknown as IHandler)
    } catch (error) {
      throw new Error(
        'cookie-parser package not found. Try to install it: npm install cookie-parser'
      )
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
    return
  }

  public registerErrorHandler(): void {
    this.app.onError((req: Request, res: Response, err: unknown) => {
      this.handleError(err, req, res)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getSingleFileUploadMiddleware(options: any, propertyName: string): Middleware {
    return fileUploader()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getMultiFileUploadMiddleware(options: any, propertyName: string): Middleware {
    return fileUploader()
  }

  protected createRouter(): Router {
    return new this.Router()
  }

  protected registerAction(
    router: Router,
    action: Action,
    middlewares: Middleware[],
    handler: IHandler
  ): void {
    router[action.method!](action.name as string, middlewares as IHandler[], handler)
  }

  protected addRequestHandler(
    path: string | RegExp,
    middlewares: IHandler[],
    router: Router
  ): void {
    middlewares.forEach((middleware) => router.use(middleware))
    this.app.use(path as string, router)
  }

  protected addMiddleware(...middlewares: Middleware[]): void {
    middlewares.forEach((middleware) => this.app.use(middleware as INextFunc))
  }

  public async listen(port: number): Promise<Server> {
    return this.app.listen(port)
  }

  protected send(res: Response, payload: any): void {
    res.send(payload)
  }

  protected sendWithStatus(res: Response, payload: any, statusCode: HttpStatus): void {
    res.status(statusCode).send(payload)
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
    res.type(contentType)
  }

  protected setLocationUrl(res: Response, locationUrl: string): void {
    res.setHeader('Location', locationUrl)
  }

  protected renderView(res: Response, view: string, data: any): void {
    res.render(view, data)
  }

  protected getBodyFromRequest(req: Request): unknown {
    return req.body
  }

  protected getCookiesFromRequest(req: Request): Record<string, string> {
    return req.cookies as Record<string, string>
  }

  protected getHeadersFromRequest(req: Request): IncomingHttpHeaders {
    return req.headers
  }

  protected getHostNameFromRequest(req: Request): string {
    return req.headers['host'] as string
  }

  protected getIpFromRequest(req: Request): string {
    return req.ip as string
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
    return req.files
  }

  protected getFilesFromRequest(req: Request): unknown {
    return req.files
  }
}
