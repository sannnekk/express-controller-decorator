import { getControllerMetadata, HTTPMethod, MethodMeta } from 'meta'
import { Middleware } from 'Middleware'

function createMethodDecorator(method: HTTPMethod) {
	return function (path: string, ...middlewares: Middleware[]) {
		return function (target: any, key: string, descriptor: any) {
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
}

export const Get = createMethodDecorator('get')
export const Post = createMethodDecorator('post')
export const Put = createMethodDecorator('put')
export const Patch = createMethodDecorator('patch')
export const Delete = createMethodDecorator('delete')
export const Head = createMethodDecorator('head')
