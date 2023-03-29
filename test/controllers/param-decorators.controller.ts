import { Request, Response } from 'express'

import {
  Controller,
  Get,
  HeaderParams,
  Host,
  Body,
  Ip,
  Params,
  Post,
  Query,
  Req,
  Request as ScorpiRequest,
  Res,
  Response as ScorpiResponse,
  Cookies
} from '../../src'

@Controller('/param-decorators')
export class ParamDecoratorsController {
  @Get('/req')
  public req(@Req() req: Request): string {
    return req.baseUrl
  }

  @Get('/request')
  public request(@ScorpiRequest() req: Request): string {
    return req.baseUrl
  }

  @Get('/res')
  public res(@Res() res: Response): void {
    res.send('OK')
  }

  @Get('/response')
  public response(@ScorpiResponse() res: Response): void {
    res.send('OK')
  }

  @Post('/body')
  public body(@Body() body: any): string {
    return body['packageName']
  }

  @Post('/body-with-property-name')
  public bodyWithPropertyName(@Body('packageName') packageName: string): string {
    return packageName
  }

  @Get('/cookies')
  public cookies(@Cookies() cookies: any): string {
    return cookies['packageName']
  }

  @Get('/cookies-with-property-name')
  public cookiesWithPropertyName(@Cookies('packageName') packageName: string): string {
    return packageName
  }

  @Get('/host')
  public host(@Host() host: string): string {
    return host
  }

  @Get('/header-params')
  public headerParams(@HeaderParams() headers: any): string {
    return headers['package-name']
  }

  @Get('/ip')
  public ip(@Ip() ip: string): string {
    return ip
  }

  @Get('/params/:packageName')
  public params(@Params() params: any): string {
    return params['packageName']
  }

  @Get('/params-with-property-name/:packageName')
  public paramsWithPropertyName(@Params('packageName') packageName: string): string {
    return packageName
  }

  @Get('/query')
  public query(@Query() query: any): string {
    return query['packageName']
  }

  @Get('/query-with-property-name')
  public queryWithPropertyName(@Query('packageName') packageName: string): string {
    return packageName
  }
}
