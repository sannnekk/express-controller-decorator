import { HTTPMethod, MethodMeta } from './meta'
import { Middleware } from './Middleware'
import fs from 'fs'
import * as YAML from 'yaml'

export interface Options {
	swagger?:
		| {
				info: {
					title: string
					description: string
					termsOfService?: string
					contact?: {
						name: string
						email: string
					}
					license?: {
						name: string
						url: string
					}
					version: string
				}
				externalDocs?: {
					description: string
					url: string
				}
		  }
		| false
	swaggerFile?: string
}

export interface SwaggerRoute {
  [key: string]: Record<HTTPMethod, SwaggerMeta>
}

export interface SwaggerMeta {
  tags: string[]
  summary: string
  description: string
  parameters: {
    name: string
    required: boolean
    schema: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object
    }
  }[]
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: object
          properties: {
            login: {
              type: string
              example: string
            }
            password: {
              type: string
              example: string
            }
          }
        }
      }
    }
  }
  responses: {
    [key: string]: {
      description: string
    }
  }
}

export class SwaggerGenerator {
	private _filePath: string = ''
	private _output = {
		openapi: '3.0.3',
		info: {
			title: 'Instagram example API',
			description:
				'Its an example of a few instagram API endpoints includeing Bearer Auth',
			termsOfService: 'example.com',
			contact: {
				name: 'Anastasiia Titova',
				email: '1901.nastya@gmnail.com',
			},
			license: {
				name: 'Apache 2.0',
				url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
			},
			version: '1.0.0',
		},
		externalDocs: {
			description: 'Find out more about Swagger',
			url: 'http://swagger.io',
		},
		servers: [
			{
				url: 'http://localhost:5000',
			},
		],
		tags: [],
		paths: {} as SwaggerRoute,
	}

	public constructor(options: any, filePath: string) {
		this._filePath = filePath
		this._output = options
	}

	public addController(
		path: string,
		middlewares: Middleware[],
		routes: {
			[key: string]: MethodMeta
		}
	): void {
		// this._output.paths[path] = {}

    Object.keys(routes).forEach((key) => {
      const route = routes[key]
      const method = route!.method
      const swagger = route!.swagger
      const path = route!.route

      if (!this._output.paths[path]) {
        this._output.paths[path] = {} as SwaggerRoute['path']
      }

      this._output.paths[path]![method] = swagger!
    })
	}

	public async save(): Promise<void> {
    const yml = YAML.stringify(this._output)
    await fs.writeFile(this._filePath, yml, () => console.log('SWAGGER File saved'))
  }
}
