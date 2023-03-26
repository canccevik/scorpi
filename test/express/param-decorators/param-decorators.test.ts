import { SuperAgentTest, agent } from 'supertest'

import { Server } from 'http'

import { ExpressAdapter, ScorpiFactory } from '../../../src'
import { ScorpiApplication } from '../../../src/scorpi-application'
import { ParamDecoratorsController } from './param-decorators.controller'

describe('[Express] Param Decorators', () => {
  let app: ScorpiApplication
  let request: SuperAgentTest
  let server: Server

  const controllerUri = '/param-decorators'

  beforeAll(async () => {
    app = await ScorpiFactory.create(ExpressAdapter, { controllers: [ParamDecoratorsController] })
    server = await app.listen(3000)
    request = agent(app.getApp())
  })

  afterAll(() => {
    server.close()
  })

  it('should req decorator work', async () => {
    const res = await request.get(controllerUri + '/req')

    expect(res.text).toEqual(controllerUri)
  })

  it('should request decorator work', async () => {
    const res = await request.get(controllerUri + '/request')

    expect(res.text).toEqual(controllerUri)
  })

  it('should res decorator work', async () => {
    const res = await request.get(controllerUri + '/res')

    expect(res.text).toEqual('OK')
  })

  it('should response decorator work', async () => {
    const res = await request.get(controllerUri + '/response')

    expect(res.text).toEqual('OK')
  })

  it('should body decorator work', async () => {
    const body = { packageName: 'scorpi' }

    const res = await request.post(controllerUri + '/body').send(body)

    expect(res.text).toEqual('scorpi')
  })

  it('should body decorator work with property name', async () => {
    const body = { packageName: 'scorpi' }

    const res = await request.post(controllerUri + '/body-with-property-name').send(body)

    expect(res.text).toEqual('scorpi')
  })

  it('should cookies decorator work', async () => {
    const res = await request
      .get(controllerUri + '/cookies')
      .set('Cookie', 'packageName=scorpi')
      .send()

    expect(res.text).toEqual('scorpi')
  })

  it('should cookies decorator work with property name', async () => {
    const res = await request
      .get(controllerUri + '/cookies-with-property-name')
      .set('Cookie', 'packageName=scorpi')
      .send()

    expect(res.text).toEqual('scorpi')
  })

  it('should host decorator work', async () => {
    const res = await request.get(controllerUri + '/host')

    expect(res.text).toEqual('127.0.0.1')
  })

  it('should header params decorator work', async () => {
    const res = await request
      .get(controllerUri + '/header-params')
      .set('package-name', 'scorpi')
      .send()

    expect(res.text).toEqual('scorpi')
  })

  it('should ip decorator work', async () => {
    const res = await request.get(controllerUri + '/ip')

    expect(res.text).toEqual('::ffff:127.0.0.1')
  })

  it('should params decorator work', async () => {
    const res = await request.get(controllerUri + '/params/scorpi')

    expect(res.text).toEqual('scorpi')
  })

  it('should params decorator work with property name', async () => {
    const res = await request.get(controllerUri + '/params-with-property-name/scorpi')

    expect(res.text).toEqual('scorpi')
  })

  it('should query decorator work', async () => {
    const res = await request.get(controllerUri + '/query?packageName=scorpi')

    expect(res.text).toEqual('scorpi')
  })

  it('should query decorator work with property name', async () => {
    const res = await request.get(controllerUri + '/query-with-property-name?packageName=scorpi')

    expect(res.text).toEqual('scorpi')
  })
})
