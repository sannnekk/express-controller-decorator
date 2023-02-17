import { ControllerResponse } from './decorators/ControllerResponse'
import { getControllerMetadata, MethodMeta } from './meta'
import express, {
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { Middleware } from './Middleware'

export function injectControllers(
	app: express.Application,
	controllers: any[]
) {
	// iterate through ech controlller
	controllers.forEach((controller) => {
		const {
			path = '/',
			middlewares,
			routes,
		} = getControllerMetadata(controller.prototype)

		const controllerInstance = new controller()
		const router = express.Router()

		// append middlewares if they exist
		if (middlewares.length > 0) {
			router.use(
				...middlewares.map((middleware: Middleware) => middleware.use)
			)
		}

		// add routes
		Object.keys(routes).forEach((route) => {
			if (routes[route]!.method !== 'fallback') {
				appendMiddleware(
					router,
					controllerInstance[route].bind(controllerInstance),
					routes[route]!
				)
			}
		})

		// find fallback route
		const fallbackRoute = Object.keys(routes).find(
			(key) => routes[key]!.method === 'fallback'
		)

		// append fallback route if it exists
		if (fallbackRoute) {
			appendMiddleware(
				router,
				controllerInstance[fallbackRoute].bind(controllerInstance),
				routes[fallbackRoute]!
			)
		}

		// append router to app
		app.use(path, router)
	})
}

function convertToMiddleware(f: Middleware['use']) {
	return async (req: Request, res: Response, next?: NextFunction) => {
		let result = f(req, res, next!)

		if (result instanceof Promise) {
			result = await result
		}

		if (
			result instanceof ControllerResponse &&
			typeof result !== 'undefined'
		) {
			Object.keys(result.headers).forEach((key) =>
				res.append(key, (result as ControllerResponse).headers[key])
			)
			res.status(result.status).send(result.body)
		} else {
			throw new Error('Invalid controller response')
		}
	}
}

function appendMiddleware(
	router: Router,
	f: Middleware['use'],
	meta: MethodMeta
) {
	const { method, middlewares, route: currentRoute } = meta

	const middlewareFunctions =
		middlewares.length > 0
			? middlewares.map((middleware: Middleware) => middleware.use)
			: []

	middlewareFunctions.push(convertToMiddleware(f))

	if (method !== 'fallback') {
		router[method](currentRoute, ...middlewareFunctions)
	} else {
		router.all(currentRoute, ...middlewareFunctions)
	}
}
