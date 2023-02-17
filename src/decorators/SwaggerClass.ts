import { getControllerMetadata } from 'meta'

export function SwaggerClass(name: string, description: string) {
	return function (target: any) {
		const meta = getControllerMetadata(target.prototype)

		meta.swaggerName = name
		meta.swaggerDescription = description
	}
}
