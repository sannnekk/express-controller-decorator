<h1 align="center">Express Controller Decorator</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/sannnekk/express-controller-decorator?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/sannnekk/express-controller-decorator?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/sannnekk/express-controller-decorator?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/sannnekk/express-controller-decorator?color=56BEB8">

  <img alt="Github issues" src="https://img.shields.io/github/issues/sannnekk/express-controller-decorator?color=56BEB8" />

  <img alt="Github stars" src="https://img.shields.io/github/stars/sannnekk/express-controller-decorator?color=56BEB8" />
</p>

<!-- Status -->

<!-- <h4 align="center">
	🚧  Express Controller Decorator 🚀 Under construction...  🚧
</h4>

<hr> -->

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/{{YOUR_GITHUB_USERNAME}}" target="_blank">Author</a>
</p>

<br>

## :dart: About

A simple, lightweit npm package to bind your controllers to express

## :sparkles: Features

:heavy_check_mark: uses modern TS decorators;\
:heavy_check_mark: support of Middleware;\
:heavy_check_mark: No need of instantiating your controllers with the
new keyword;

## :rocket: Technologies

The following tools were used in this project:

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have
[express](https://expressjs.com) and
[Typescript v.4.4 or above](https://www.typescriptlang.org/) installed.

## :checkered_flag: Installing

```bash
# Install it with npm
$ npm i --save express-controller-decorator

# Install it with yarn
$ yarn add express-controller-decorator

# Install it with pnpm
$ pnpm add express-controller-decorator
```

## :arrow_forward: Usage

First of all, add a `@Controller` decorator to your Controller. Then,
add `@HTTPMethod `decorators to the methods you wish to be invoked for
each http method.

NOTE: All methods that are marked with HTTP method decorators must
return `ControllerResponse` or `Promise<ControllerResponse>` instance.

Request and Response args will be injected automatically

```ts
@Controller('/user')
export class SomeController {
	@Post('/:id') // Request and Response args will be injected automatically
	public getUser(req: Request, res: Response): ControllerResponse {
		// ...some code

		return new ControllerResponse(body, status, headers)
	}

	// NOTE: decorator params are optional
	@Post()
	public createUser(req: Request, res: Response): ControllerResponse {
		// ...some code

		// NOTE: All args here are optional
		return new ControllerResponse(null, 200)
	}
}
```

The following decorators are available:

- `Controller(path: string)` - Decorator to mark classes that are
  controllers
- `Post(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Get(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Delete(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Put(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Patch(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Head(path: string = '/', ...middlewares: Middleware[])` - Method
  decorator
- `Fallback(...middlewares: Middleware[])` - Method decorator to mark a
  fallback method. It will be invoked when no other route/method passes

Then, you need to add your controllers to the express app instance in
your `main.ts` file:

```ts
const app = express()

injectControllers(app)
app.listen(3010)
```

**NEW in 1.3.0:** You can create a custom `Context` class and make this
lib use it instead of express' `Request` and `Response` classes. To do
so, you need to pass your custom `Context` class to `setContextClass`
function BEFORE calling `injectControllers` function. Example:

```ts
const app = express()

class MyContext {
	// ...some code

	// req argument is optional
	constructor(req: Request) {
		// ...some code
	}
}

setContextClass(MyContext)
injectControllers(app)

app.listen(3010)
```

If you did specify a custom `Context` class, you MUST use it instead of
express' `Request` and `Response` types in your controller methods.
Example:

```ts
@Controller('/user')
export class SomeController {
	// will work if you specified a custom Context class
	@Post('/:id')
	public getUser(ctx: MyContext): ControllerResponse {
		// ...some code

		return new ControllerResponse(body, status, headers)
	}

	// will NOT work if you specified a custom Context class
	@Post('/:id')
	public getUser(req: Request, res: Response): ControllerResponse {
		// ...some code

		return new ControllerResponse(body, status, headers)
	}
}
```

There's also a `Middleware` interface. If you wish to create a
Middleware and then use it in your decorators, you must create each
Middleware as a class implementing this interface. It has only one
method: `use()` that will be invoked while using the route the
middleware sits in. Example:

```ts
interface Middleware {
	use(
		request: Request,
		response: Response,
		next: NextFunction
	): void | Promise<void>
}
```

If you wish to add some middlewares to your Controller or to a specific
method:

```ts
@Controller('/', new Middleware1(), new Middleware2(), ...)
```

or

```ts
@Get('', new Middleware1(), new Middleware2(), ...)
```

Note! The middlewares you pass are executed before your method. THe must
implement the `Middleware` interface

Example:

```ts
class SomeMiddleware implements Middleware {
	use(
		request: Request,
		response: Response,
		next: NextFunction
	): void | Promise<void> {
		// ... some usefull code
	}
}

@Controller('/auth', new SomeMiddleware()) // <-- Passing Middleware in Controller decorator means it will be invoked before EVERY route in this class
class MyController {
	@Get('/', new SomeMiddleware()) // <-- This Middleware will be used only for this route and this method
	public foo(req: Request, res: Response): ControllerResponse {
		// ...some usefull code
	}
}
```

## :white_check_mark: Todo

- :white_check_mark: Middleware support
- :white_check_mark: Fallback route
- Generate swagger file

## :memo: License

This project is under license from MIT. For more details, see the
[LICENSE](LICENSE.md) file

Made with :heart: by
<a href="https://github.com/sannnekk" target="_blank">sannnekk</a>

&#xa0;

<a href="#top">Back to top</a>
