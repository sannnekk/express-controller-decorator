import express from 'express'
import { Controller } from '../src/decorators/Controller'
import { injectControllers } from '../src/injection'
import { Get } from '../src/decorators/methods'
import { ControllerResponse } from '../src/decorators/ControllerResponse'

@Controller('/test')
class TestController {
	@Get('/test2/:id')
	getTest(req: express.Request, res: express.Response) {
		console.log('Worked!')
		return new ControllerResponse('Test ' + req.params.id, 405)
	}
}

const app = express()
injectControllers(app)

app.listen(3010, () => console.log('Listening on port 3010'))
