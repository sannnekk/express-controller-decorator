import { Controller } from '../src/decorators/Controller'
import express from 'express'
import { injectControllers } from '../src/injection'
import { Get } from '../src/decorators/methods'
import { ControllerResponse } from '../src/decorators/ControllerResponse'

@Controller('/test')
class TestController {
	@Get('/test2')
	getTest(req: express.Request, res: express.Response) {
		console.log(req, res)
		return new ControllerResponse('Hui')
	}
}

const app = express()

injectControllers(app, [TestController])

app.listen(3010)
