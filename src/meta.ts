import { Middleware } from 'Middleware'

export interface ControllerClass {
	__controller_decorator_metadata__?: IControllerMetadata
}

export interface MethodMeta {
	route: string
	method: HTTPMethod
	middlewares: Middleware[]
}

export interface IControllerMetadata {
	path?: string
	middlewares: Middleware[]
	routes: {
		[key: string]: MethodMeta
	}
}

export type HTTPMethod =
	| 'post'
	| 'get'
	| 'put'
	| 'patch'
	| 'delete'
	| 'head'

export function getControllerMetadata(
	target: ControllerClass
): IControllerMetadata {
	if (!target.__controller_decorator_metadata__) {
		target.__controller_decorator_metadata__ = {
			path: undefined,
			middlewares: [],
			routes: {},
		}
	}

	return target.__controller_decorator_metadata__
}
