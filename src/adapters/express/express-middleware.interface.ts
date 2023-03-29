import { NextFunction, Request, Response } from 'express'

import { ScorpiMiddleware } from '../../interfaces'

export type ExpressMiddleware = ScorpiMiddleware<Request, Response, NextFunction>
