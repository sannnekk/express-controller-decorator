import { ControllerResponse } from './decorators/ControllerResponse'
import { NextFunction, Request, Response } from 'express'

export interface Middleware {
	_swagger_tags?: string[]

	use(
		request: Request,
		response: Response,
		next: NextFunction
	):
		| void
		| Promise<void>
		| ControllerResponse
		| Promise<ControllerResponse>
}
