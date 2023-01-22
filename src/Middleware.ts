import { NextFunction, Request, Response } from 'express'

export interface Middleware {
	use(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void>
}
