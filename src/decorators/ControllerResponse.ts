import HttpStatusCode from './HTTPStatusCodes'

export class ControllerResponse {
	constructor(
		public body: any,
		public status: number = 200,
		public headers: { [key: string]: string } = {}
	) {}

	public appendHeader(key: string, value: string) {
		this.headers[key] = value
	}

	public setStatus(status: HttpStatusCode) {
		this.status = status
	}

	public setBody(body: any) {
		this.body = body
	}
}
