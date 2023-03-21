import { Request, Response } from 'express'

import { ScorpiExceptionHandler } from '../../interfaces'

export type ExpressExceptionHandler = ScorpiExceptionHandler<Request, Response>
