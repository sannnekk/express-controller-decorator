import { ControllerResponse } from './decorators/ControllerResponse'
import { getControllerMetadata } from './meta'
import express, { NextFunction, Request, Response } from 'express'
import { Middleware } from './Middleware'

export function injectControllers(
	app: express.Application,
	controllers: any[]
) {
	controllers.forEach((controller) => {
		const {
			path = '/',
			middlewares,
			routes,
		} = getControllerMetadata(controller)

		const controllerInstance = new controller()
		const router = express.Router()

		router.use(
			...middlewares.map((middleware: Middleware) => middleware.use)
		)

		Object.keys(routes).forEach((route) => {
			if (controllerInstance.hasOwnProperty(route)) {
				const { method, middlewares, route: path } = routes[route]!

				router[method](
					path,
					...middlewares.map((middleware: any) => middleware.use),
					convertMiddleware(controllerInstance[route])
				)
			}
		})

		app.use(path, router)
	})
}

function convertMiddleware(
	f: (
		req: Request,
		res: Response,
		next: NextFunction
	) => ControllerResponse
) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = f(req, res, next)

		if (result instanceof Promise) {
			result
				.then((result) => {
					if (result instanceof ControllerResponse) {
						Object.keys(result.headers).forEach((key) =>
							res.append(key, result.headers[key])
						)
						res.status(result.status).send(result.body)
					} else {
						throw new Error('Invalid controller response')
					}
				})
				.catch((error) => {
					next(error)
				})
		} else if (result instanceof ControllerResponse) {
			res.status(result.status).send(result.body)
		} else {
			throw new Error('Invalid controller response')
		}
	}
}
