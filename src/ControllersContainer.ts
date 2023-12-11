import { ControllerClass } from './meta'

type ConstructableControllerClass = { new (): ControllerClass }

class Container {
	private static _instance: Container

	controllers: ConstructableControllerClass[] = []

	private constructor() {}

	public static get Instance() {
		return this._instance || (this._instance = new this())
	}

	getControllers(): ConstructableControllerClass[] {
		return this.controllers
	}

	addController(controller: ConstructableControllerClass): void {
		this.controllers.push(controller)
	}
}

export const ControllerContainer = Container.Instance
