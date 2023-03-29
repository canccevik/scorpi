import { INextFunc, Request, Response } from 'lungojs'

import { ScorpiMiddleware } from '../../interfaces'

export type LungoMiddleware = ScorpiMiddleware<Request, Response, INextFunc>
