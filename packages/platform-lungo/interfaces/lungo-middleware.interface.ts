import { INextFunc, Request, Response } from 'lungojs'

import { ScorpiMiddleware } from '@scorpijs/core/interfaces'

export type LungoMiddleware = ScorpiMiddleware<Request, Response, INextFunc>
