import { Request } from 'express'

export abstract class Context {
	private static _contextClass: { new (req?: Request): object } | null =
		null
	private static _bindings = new WeakMap<Request, object>()

	static setContextClass(context: { new (): object }) {
		Context._contextClass = context
	}

	static getContextClass() {
		return Context._contextClass
	}

	static bind(request: Request): object {
		if (!Context._contextClass) {
			throw new Error('Context class not set but intended to be used')
		}

		const value = new Context._contextClass(request)
		Context._bindings.set(request, value)

		return value
	}

	static get(request: Request): object {
		const _context = Context._bindings.get(request)

		if (!_context) {
			throw new Error('Context not found')
		}

		return _context
	}
}
