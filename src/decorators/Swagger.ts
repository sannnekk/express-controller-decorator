import { getControllerMetadata } from '../meta'
import HttpStatusCode from 'http-status-codes'

export function Swagger(
	name: string,
	description: string,
	/* TODO: requestSchema: string,
	responseSchema: string, */
	responseCodes: number[]
) {
	return function (
		target: any,
		key: string,
		descriptor?: PropertyDescriptor
	) {
		const meta = getControllerMetadata(target.prototype)

		const responses = {} as Record<string, any>

		responseCodes.forEach(
			(code) =>
				(responses[String(code)] = {
					description: HttpStatusCode.getStatusText(code),
				})
		)

		meta.routes[key]!.swagger = {
			tags: [meta.swaggerName],
			summary: name,
			description: description,
			parameters: [],
			requestBody: {} as any,
			responses,
		}

		return descriptor
	}
}
