import { Request, Response } from 'lungojs'

import { ScorpiExceptionHandler } from '../../interfaces'

export type LungoExceptionHandler = ScorpiExceptionHandler<Request, Response>
