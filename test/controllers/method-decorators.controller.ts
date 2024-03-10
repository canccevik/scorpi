import {
  ContentType,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Patch,
  Post,
  Put,
  Redirect,
  StatusCode
} from '../../packages/core'

@Controller('/method-decorators')
export class MethodDecoratorsController {
  @Get('/')
  public get(): string {
    return 'OK'
  }

  @Post('/')
  public post(): string {
    return 'OK'
  }

  @Put('/')
  public put(): string {
    return 'OK'
  }

  @Patch('/')
  public patch(): string {
    return 'OK'
  }

  @Delete('/')
  public delete(): string {
    return 'OK'
  }

  @Get('/status-code')
  @StatusCode(HttpStatus.I_AM_A_TEAPOT)
  public statusCode(): string {
    return 'OK'
  }

  @Get('/content-type')
  @ContentType('application/json')
  public contentType(): Record<string, string> {
    return { message: 'OK' }
  }

  @Get('/headers')
  @Headers({ key: 'package-name', value: 'scorpi' })
  public headers(): string {
    return 'OK'
  }

  @Get('/redirect')
  @Redirect('/')
  public redirect(): number {
    return 0
  }
}
