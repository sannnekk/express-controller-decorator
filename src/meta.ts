import { SwaggerMeta } from './swaggerGenerator'
import { Middleware } from './Middleware'

export interface ControllerClass extends Object {
	__controller_decorator_metadata__?: IControllerMetadata
}

export interface MethodMeta {
	route: string
	method: HTTPMethod
	middlewares: Middleware[]
	swagger?: SwaggerMeta
}

export interface IControllerMetadata {
	swaggerName: string
	swaggerDescription: string
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
	| 'fallback'

export function getControllerMetadata(
	target: ControllerClass
): IControllerMetadata {
	if (!target.__controller_decorator_metadata__) {
		target.__controller_decorator_metadata__ = {
			swaggerDescription: '',
			swaggerName: '',
			path: undefined,
			middlewares: [],
			routes: {},
		}
	}

	return target.__controller_decorator_metadata__
}
