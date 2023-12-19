import express from 'express'
import { Controller } from '../src/decorators/Controller'
import { injectControllers, setContextClass } from '../src/injection'
import { Get } from '../src/decorators/methods'
import { ControllerResponse } from '../src/decorators/ControllerResponse'

@Controller('/test')
class TestController {
	@Get('/test2/:id')
	getTest(context: Context) {
		console.log('Worked!')
		console.log(context.a)
		return new ControllerResponse('Test 12', 405)
	}
}

class Context {
	a: any

	constructor(req: express.Request) {
		console.log('Context created')
		this.a = req.headers
	}
}

const app = express()

setContextClass(Context)
injectControllers(app)

app.listen(3010, () => console.log('Listening on port 3010'))
