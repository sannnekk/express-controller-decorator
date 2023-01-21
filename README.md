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
:heavy_check_mark: No need of instantiating your controllers with the new keyword;

## :rocket: Technologies

The following tools were used in this project:

- [Expo](https://expo.io/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [express](https://expressjs.com) and [Typescript v.4.4 or above](https://www.typescriptlang.org/) installed.

And you also need the support of experimental decorators in your tsconfig.json file:

```json
{
	"compilerOptions": {
		"experimentalDecorators": true
	}
}
```

## :checkered_flag: Starting

```bash
# Install it with npm
$ npm i --save express-controller-decorator
```

## :usage: Usage

First of all, add a Controller decorator to your Controller. Then, add HTTPMethod decorators to the methods you wish to be invoked for each http method.

NOTE: All methods that are marked with HTTP method decorators must return ControllerResponse or Promise<ControllerResponse> instance.

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

There's a Middleare abstract class. If you wish to add some middlewares to your Controller or to a specific method:

```ts
@Controller('/', new Middleware1(), new Middleware2(), ...)
```

or

```ts
@Get('', new Middleware1(), new Middleware2(), ...)
```

Note! The middlewares you pass are executed before your method

## :memo: License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with :heart: by <a href="https://github.com/sannnekk" target="_blank">sannnekk</a>

&#xa0;

<a href="#top">Back to top</a>
