import { Controller } from '../src/decorators/Controller'
import express from 'express'
import { injectControllers } from '../src/injection'
import { Get } from '../src/decorators/methods'
import { ControllerResponse } from '../src/decorators/ControllerResponse'
import { Middleware } from '../src/Middleware'

class SomeMiddleware implements Middleware {
	use(
		request: express.Request,
		response: express.Response,
		next: express.NextFunction
	): void {
		console.log('MIIIIID')

		if (request.params.id == '1') {
			next()
		} else {
			response.status(202).send('KOKOKO')
		}
	}
}

@Controller('/test', new SomeMiddleware())
class TestController {
	@Get('/test2/:id')
	getTest(req: express.Request, res: express.Response) {
		console.log(req, res)
		return new ControllerResponse('Hui' + req.params.id, 405)
	}
}

const app = express()

injectControllers(app, [TestController])

app.listen(3010)
