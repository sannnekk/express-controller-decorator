import { ControllerResponse } from './decorators/ControllerResponse'
import {
	ControllerClass,
	getControllerMetadata,
	MethodMeta,
} from './meta'
import express, {
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { Middleware } from './Middleware'
import { ControllerContainer } from './ControllersContainer'
import { Context } from './Context'

type ControllerKey = keyof Omit<ControllerClass, `__${string}`>

export function setContextClass(context: any) {
	Context.setContextClass(context)
}

export function injectControllers(app: express.Application) {
	const controllers = ControllerContainer.getControllers()

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
				...middlewares.map((middleware: Middleware) =>
					convert(middleware.use.bind(middleware), true)
				)
			)
		}

		// add routes
		Object.keys(routes).forEach((route) => {
			if (routes[route]!.method !== 'fallback') {
				append(
					router,
					(
						controllerInstance[route as ControllerKey] as (
							...args: any[]
						) => any
					).bind(controllerInstance),
					routes[route]!,
					false
				)
			}
		})

		// find fallback route
		const fallbackRoute = Object.keys(routes).find(
			(key) => routes[key]!.method === 'fallback'
		)

		// append fallback route if it exists
		if (fallbackRoute) {
			append(
				router,
				(
					controllerInstance[fallbackRoute as ControllerKey] as (
						...args: any[]
					) => any
				).bind(controllerInstance),
				routes[fallbackRoute]!,
				false
			)
		}

		// append router to app
		app.use(path, router)
	})
}

function convert(
	f:
		| Middleware['use']
		| ((context: object) => ReturnType<Middleware['use']>),
	isMiddleware = false
) {
	return async (req: Request, res: Response, next?: NextFunction) => {
		let result: ReturnType<Middleware['use']>

		if (Context.getContextClass() && !isMiddleware) {
			result = (
				f as (context: object) => ReturnType<Middleware['use']>
			)(Context.bind(req))
		} else {
			result = f(req, res, next!)
		}

		if (result instanceof Promise) result = await result

		if (
			result instanceof ControllerResponse &&
			typeof result !== 'undefined'
		) {
			Object.keys(result.headers).forEach((key) =>
				res.append(key, (result as ControllerResponse).headers[key])
			)
			res.status(result.status).send(result.body)
		}
	}
}

function append(
	router: Router,
	f: Middleware['use'],
	meta: MethodMeta,
	isMiddleware = false
) {
	const { method, middlewares, route: currentRoute } = meta

	const middlewareFunctions =
		middlewares.length > 0
			? middlewares.map((middleware: Middleware) =>
					convert(middleware.use.bind(middleware), isMiddleware)
			  )
			: []

	middlewareFunctions.push(convert(f, isMiddleware))

	if (method !== 'fallback') {
		router[method](currentRoute, ...middlewareFunctions)
	} else {
		router.all(currentRoute, ...middlewareFunctions)
	}
}
