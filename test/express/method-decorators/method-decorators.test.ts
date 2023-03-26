import { SuperAgentTest, agent } from 'supertest'

import { Server } from 'http'

import { ExpressAdapter, HttpStatus, ScorpiFactory } from '../../../src'
import { ScorpiApplication } from '../../../src/scorpi-application'
import { MethodDecoratorsController } from './method-decorators.controller'

describe('[Express] HTTP Method Decorators', () => {
  let app: ScorpiApplication
  let request: SuperAgentTest
  let server: Server

  const controllerUri = '/method-decorators'

  beforeAll(async () => {
    app = await ScorpiFactory.create(ExpressAdapter, { controllers: [MethodDecoratorsController] })
    server = await app.listen(3000)
    request = agent(app.getApp())
  })

  afterAll(() => {
    server.close()
  })

  it('should get method work', async () => {
    const res = await request.get(controllerUri)

    expect(HttpStatus.OK).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should post method work', async () => {
    const res = await request.post(controllerUri)

    expect(HttpStatus.CREATED).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should put method work', async () => {
    const res = await request.put(controllerUri)

    expect(HttpStatus.OK).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should patch method work', async () => {
    const res = await request.patch(controllerUri)

    expect(HttpStatus.OK).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should delete method work', async () => {
    const res = await request.delete(controllerUri)

    expect(HttpStatus.OK).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should status code decorator work', async () => {
    const res = await request.get(controllerUri + '/status-code')

    expect(HttpStatus.I_AM_A_TEAPOT).toEqual(res.statusCode)
    expect(res.text).toEqual('OK')
  })

  it('should content type decorator work', async () => {
    const res = await request.get(controllerUri + '/content-type')

    expect(res.headers['content-type'].split(';')[0]).toEqual('application/json')
    expect(res.body).toEqual({ message: 'OK' })
  })

  it('should headers decorator work', async () => {
    const res = await request.get(controllerUri + '/headers')

    expect(res.headers['package-name']).toEqual('scorpi')
    expect(res.text).toEqual('OK')
  })

  it('should redirect decorator work', async () => {
    const res = await request.get(controllerUri + '/redirect')

    expect(res.headers['location']).toEqual('/')
  })
})
