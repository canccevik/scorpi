import { NextFunction, Request, Response } from 'express'

import { ScorpiMiddleware } from '@scorpijs/core/interfaces'

export type ExpressMiddleware = ScorpiMiddleware<Request, Response, NextFunction>
