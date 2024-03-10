import { Request, Response } from 'express'

import { ScorpiExceptionHandler } from '@scorpijs/core/interfaces'

export type ExpressExceptionHandler = ScorpiExceptionHandler<Request, Response>
