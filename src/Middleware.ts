import { NextFunction, Request, Response } from 'express'

export abstract class Middleware {
	public abstract use(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void>
}
