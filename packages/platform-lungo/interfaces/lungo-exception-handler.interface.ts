import { Request, Response } from 'lungojs'

import { ScorpiExceptionHandler } from '@scorpijs/core/interfaces'

export type LungoExceptionHandler = ScorpiExceptionHandler<Request, Response>
