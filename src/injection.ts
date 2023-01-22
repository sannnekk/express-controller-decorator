import { ControllerResponse } from './decorators/ControllerResponse'
import { getControllerMetadata } from './meta'
import express, { Request, Response } from 'express'
//import { Middleware } from './Middleware'

export function injectControllers(
	app: express.Application,
	controllers: any[]
) {
	controllers.forEach((controller) => {
		const {
			path = '/',
			middlewares,
			routes,
		} = getControllerMetadata(controller.prototype)

		const controllerInstance = new controller()
		const router = express.Router()

		if (middlewares.length > 0) {
			/* router.use(
				...middlewares.map((middleware: Middleware) => middleware.use)
			) */
		}

		Object.keys(routes).forEach((route) => {
			if (controllerInstance.hasOwnProperty(route)) {
				const {
					method,
					middlewares,
					route: currentRoute,
				} = routes[route]!

				const middlewareFunctions =
					middlewares.length > 0
						? middlewares.map((middleware: any) => middleware.use)
						: []

				middlewareFunctions.push(
					convertToMiddleware(controllerInstance[route])
				)

				router[method](currentRoute, ...middlewareFunctions)
			}
		})

		app.use(path, router)
	})
}

function convertToMiddleware(
	f: (req: Request, res: Response) => ControllerResponse
) {
	return (req: Request, res: Response) => {
		const result = f(req, res)

		if (result instanceof Promise) {
			result.then((result) => {
				if (result instanceof ControllerResponse) {
					Object.keys(result.headers).forEach((key) =>
						res.append(key, result.headers[key])
					)
					res.status(result.status).send(result.body)
				} else {
					throw new Error('Invalid controller response')
				}
			})
		} else if (result instanceof ControllerResponse) {
			res.status(result.status).send(result.body)
		} else {
			throw new Error('Invalid controller response')
		}
	}
}
