import { getControllerMetadata } from 'meta'
import express from 'express'

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

		router.use(...middlewares.map((middleware: any) => middleware.use))

		Object.keys(routes).forEach((route) => {
			if (controllerInstance.hasOwnProperty(route)) {
				const { method, middlewares, route: path } = routes[route]!

				router[method](
					path,
					...middlewares.map((middleware: any) => middleware.use),
					controllerInstance[route]
				)
			}
		})

		app.use(path, router)
	})
}
