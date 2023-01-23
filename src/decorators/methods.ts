import {
	ControllerClass,
	getControllerMetadata,
	HTTPMethod,
	MethodMeta,
} from '../meta'
import { Middleware } from '../Middleware'

function createMethodDecorator(
	method: HTTPMethod,
	path: string,
	...middlewares: Middleware[]
) {
	return function (
		target: ControllerClass,
		key: string,
		descriptor?: any
	) {
		const controllerMetadata = getControllerMetadata(target)
		const methodMetadata: MethodMeta = {
			route: path,
			method,
			middlewares,
		}

		controllerMetadata.routes[key] = methodMetadata

		return descriptor
	}
}

export function Get(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('get', path, ...middlewares)
}

export function Post(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('post', path, ...middlewares)
}

export function Put(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('put', path, ...middlewares)
}

export function Patch(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('patch', path, ...middlewares)
}

export function Delete(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('delete', path, ...middlewares)
}

export function Head(path: string, ...middlewares: Middleware[]) {
	return createMethodDecorator('head', path, ...middlewares)
}

export function Fallback(...middlewares: Middleware[]) {
	return createMethodDecorator('fallback', 'all', ...middlewares)
}
