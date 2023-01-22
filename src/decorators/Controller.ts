import { getControllerMetadata, ControllerClass } from '../meta'
import { Middleware } from '../Middleware'

export function Controller(path: string, ...middlewares: Middleware[]) {
	return function (target: ControllerClass) {
		const metadata = getControllerMetadata((target as any).prototype)

		metadata.path = path
		metadata.middlewares = middlewares
	}
}
