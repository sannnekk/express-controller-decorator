import { ControllerContainer } from '../ControllersContainer'
import { getControllerMetadata, ControllerClass } from '../meta'
import { Middleware } from '../Middleware'

// NOTE: The return type of this function is `any` to make compiler happy
export function Controller(
	path: string,
	...middlewares: Middleware[]
): any {
	return function (target: ControllerClass): void {
		ControllerContainer.addController(target)
		const metadata = getControllerMetadata(target.prototype)

		metadata.path = path
		metadata.middlewares = middlewares
	}
}
