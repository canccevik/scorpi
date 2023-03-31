<p align="center">
<img src="https://raw.githubusercontent.com/canccevik/scorpi/main/.github/assets/logo.png" alt="Scorpi Logo" width="500" height="150"/>
</p>

<p align="center">💎 A modern web framework that is built on top of <a href="https://github.com/expressjs/express">Express</a> and <a href="https://github.com/canccevik/lungo">Lungo</a>. It provides a decorator-based approach for building scalable and well-structured APIs.</p>

# Table of Contents

- [Installation](#installation)
- [Example usage](#example-usage)
- [More examples](#more-examples)
  - [Returning promises](#returning-promises)
  - [Using Request and Response objects](#using-request-and-response-objects)
  - [Loading all controllers by file suffix](#loading-all-controllers-by-file-suffix)
  - [Loading all global middlewares by file suffix](#loading-all-global-middlewares-by-file-suffix)
  - [Prefix all controller routes](#prefix-all-controller-routes)
  - [Prefix controller with base route](#prefix-controller-with-base-route)
  - [Inject routing parameters](#inject-routing-parameters)
  - [Inject query parameters](#inject-query-parameters)
  - [Inject request body](#inject-request-body)
  - [Inject request header parameters](#inject-request-header-parameters)
  - [Inject cookie parameters](#inject-cookie-parameters)
  - [Inject session object](#inject-session-object)
  - [Inject uploaded files](#inject-uploaded-files)
  - [Inject host](#inject-host)
  - [Inject ip](#inject-ip)
  - [Convert parameters to objects](#convert-parameters-to-objects)
  - [Set custom HTTP status code](#set-custom-http-status-code)
  - [Set custom ContentType](#set-custom-contenttype)
  - [Set Redirect](#set-redirect)
  - [Set Location](#set-location)
  - [Set custom headers](#set-custom-headers)
  - [Render templates](#render-templates)
  - [Throw HTTP exceptions](#throw-http-exceptions)
  - [Enable CORS](#enable-cors)
- [Using middlewares](#using-middlewares)
  - [Use existing middleware](#use-existing-middleware)
  - [Creating your own middlewares](#creating-your-own-middlewares)
  - [Global middlewares](#global-middlewares)
  - [Exception handlers](#exception-handlers)
- [Creating instances of classes from action params](#creating-instances-of-classes-from-action-params)
- [Auto validating action params](#auto-validating-action-params)
- [Using dependency injection](#using-dependency-injection)
- [Contributing](#contributing)
- [License](#license)

# Installation

1. Install scorpi:

   ```ts
   npm install scorpi
   ```

2. Install web framework:

   If you want to use Scorpi with Express:

   ```ts
   npm install express
   ```

   Or if you want to use Scorpi with Lungo:

   ```ts
   npm install lungojs
   ```

3. Install class validation and class transformation packages:

   ```ts
   npm install class-validator class-transformer
   ```

4. Set this options in `tsconfig.json` file of your project:

   ```ts
   {
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true
   }
   ```

# Example usage

1. Create a file `user.controller.ts`

```ts
import { Body, Controller, Delete, Get, Params, Post, Put } from 'scorpi'

@Controller('/users')
export class UserController {
  @Get('/')
  public getAll(): string {
    return 'Return all users'
  }

  @Get('/:id')
  public getById(@Params('id') id: number): string {
    return `Return the user with id ${id}`
  }

  @Post('/')
  public create(@Body() user: any): string {
    return 'Create the user'
  }

  @Put('/:id')
  public update(@Params('id') id: number, @Body() user: any): string {
    return 'Update the user'
  }

  @Delete('/:id')
  public delete(@Params('id') id: number): string {
    return 'Delete the user'
  }
}
```

2. Create a file `index.ts`

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'
import { UserController } from './user.controller'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    controllers: [UserController]
  })
  await app.listen(3000)
}

bootstrap()
```

> Note: You can also use LungoAdapter instead of ExpressAdapter to work with Lungo.

3. Open in browser `http://localhost:3000/users`. You will see `Return all users` in your browser. If you open `http://localhost:3000/users/10` you will see `Return the user with id 10` in your browser.

# More examples

## Returning promises

You can return promises in your controller. Scorpi will wait until promise resolved and return promise result in the response body.

```ts
import { Body, Controller, Get, Params, Post } from 'scorpi'

@Controller('/users')
export class UserController {
  @Get('/')
  public async getAll(): Promise<User[]> {
    return userRepository.findAll()
  }

  @Get('/:id')
  public async getById(@Params('id') id: number): Promise<User> {
    return userRepository.findById(id)
  }

  @Post('/')
  public async create(@Body() user: User): Promise<User> {
    return userRepository.create(user)
  }
}
```

## Using Request and Response objects

You can use framework's request and response objects directly.

```ts
import { Request, Response } from 'express'
import { Controller, Get, Req, Res } from 'scorpi'

@Controller('/users')
export class UserController {
  @Get('/')
  public getAll(@Req() req: Request, @Res() res: Response): void {
    res.send('Send all of the users...')
  }
}
```

> Note: Instead of using the `@Req()` decorator, you can use the `@Request()` decorator, and similarly, you can use the `@Response()` decorator instead of `@Res()`.

## Loading all controllers by file suffix

By specifying the suffix of your controller files, you can load all controllers from anywhere in your project.

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    controllers: '*.controller.ts'
  })
  await app.listen(3000)
}

bootstrap()
```

## Loading all global middlewares by file suffix

By specifying the suffix of your global middleware files, you can load all global middlewares from anywhere in your project.

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    middlewares: '*.middleware.ts'
  })
  await app.listen(3000)
}

bootstrap()
```

## Prefix all controller routes

You can use the `globalPrefix` option to specify a prefix for all controller routes in your application.

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    globalPrefix: '/api'
  })
  await app.listen(3000)
}

bootstrap()
```

## Prefix controller with base route

You can prefix all actions of a specific controller with the base route.

```ts
@Controller('/users')
export class UserController {
  // ...
}
```

## Inject routing parameters

To inject parameters into your controller actions, use the `@Params()` decorator.

```ts
@Get('/:id')
public getById(@Params('id') id: number): string {
  return `Return the user with id ${id}`
}
```

If you want to inject all parameters, use the `@Params()` decorator without passing any parameters.

## Inject query parameters

To inject query parameters, use the `@Query()` decorator.

```ts
@Get('/')
public getById(@Query('id') id: number): void {
  return `Return the user with id ${id}`
}
```

If you want to inject all queries, use the `@Query()` decorator without passing any parameters.

## Inject request body

To inject request body, use the `@Body()` decorator.

```ts
@Post('/')
public createUser(@Body() user: User): string {
  return 'Create the user'
}
```

## Inject request header parameters

To inject request header parameters, use the `@HeaderParams()` decorator.

```ts
@Get('/')
public index(@HeaderParams() headers: any): void {
  // ...
}
```

## Inject cookie parameters

To inject cookie parameters, use the `@Cookies()` decorator.

```ts
@Get('/')
public index(@Cookies('token') token: string): void {
  // ...
}
```

If you want to inject all cookies, use the `@Cookies()` decorator without passing any parameters.

## Inject session object

To inject session object, use the `@Session()` decorator.

```ts
@Post('/')
public index(@Session() session: any): void {
  // ...
}
```

## Inject uploaded files

To inject uploaded files, use the `@UploadedFiles()` decorator.

```ts
@Post('/')
public upload(@UploadedFiles('fileName') files: any): void {
  // ...
}
```

## Inject host

To inject host from request, use the `@Host()` decorator.

```ts
@Get('/')
public index(@Host() host: string): void {
  // ...
}
```

## Inject ip

To inject ip from request, use the `@Ip()` decorator.

```ts
@Get('/')
public index(@Ip() ip: string): void {
  // ...
}
```

## Convert parameters to objects

If you specify a class type as a parameter and decorate it with the parameter decorator, Scorpi will use [class-transformer](https://github.com/typestack/class-transformer) to create an instance of that class type.

## Set custom HTTP status code

You can use the `@StatusCode()` decorator to set the HTTP status code for any action.

```ts
import { HttpStatus } from 'scorpi'

@Get('/')
@StatusCode(HttpStatus.I_AM_A_TEAPOT)
public index(@Res() res: Response): void {
  res.end()
}
```

> Note: Most HTTP status codes can be accessed directly through the HttpStatus enum.

## Set custom ContentType

You can use the `@ContentType()` decorator to set the ContentType of any action.

```ts
@Get('/')
@ContentType('text/html')
public index(): string {
  return '<h1>Hello from Scorpi!</h1>'
}
```

## Set Redirect

You can use the `@Redirect()` decorator to set a Redirect header for any action.

```ts
@Get('/')
@Redirect('https://github.com')
public index(@Res() res: Response): void {
  res.end()
}
```

## Set Location

You can use the `@Location()` decorator to set a Location header for any action.

```ts
@Get('/')
@Location('https://github.com')
public index(@Res() res: Response): void {
  res.end()
}
```

## Set custom headers

You can use the `@Headers()` decorator to set any custom header in a response.

```ts
@Get('/')
@Headers({ key: 'x-package-name', 'scorpi' })
public index(@Res() res: Response): void {
  res.end()
}
```

## Render templates

First, you need to install the view engine package that is compatible with your web framework. For instance:

```ts
npm i pug
```

Next, you need to specify the view engine options within the app options:

```ts
const app = await ScorpiFactory.create(ExpressAdapter, {
  controllers: [UserController],
  viewEngine: {
    // assuming that you have installed 'pug'
    name: 'pug',
    // the folder containing our template files
    views: path.join(__dirname + '/views')
  }
})
```

Next, we will create a template file in the `views` folder.

Create a new file called `greetings.pug` in our `views` folder:

```
h1 Hello from Pug template!
```

Finally, we need to render the template from our action:

```ts
@Get('/')
@Render('greetings.pug')
public index(): void {}
```

## Throw HTTP exceptions

If you need to return errors with specific error codes, there is a simple solution:

```ts
@Get('/:id')
public async getById(@Params('id') id: number): Promise<User> {
  const user = await userRepository.findById(id)

  if (!user) {
    throw new NotFoundException('User cannot found.')
  }
  return user
}
```

If a user is not found with the requested ID, the response will have an HTTP status code of 404 and include the following content:

```ts
{
  "statusCode": 404,
  "message": "User cannot found.",
  "error": "Not Found"
}
```

There are set of prepared exceptions you can use:

- HttpException
- BadRequestException
- BadGatewayException
- ConflictException
- ForbiddenException
- HttpVersionNotSupportedException
- ImATeapotException
- InternalServerErrorException
- MethodNotAllowedException
- MisdirectedException
- NotAcceptableException
- NotFoundException
- NotImplementedException
- RequestTimeoutException
- ServiceUnavailableException
- UnauthorizedException
- UnsupportedMediaTypeException

## Enable CORS

As CORS is a feature utilized in nearly all web API applications, you can enable it within the Scorpi options.

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    cors: true
  })
  await app.listen(3000)
}

bootstrap()
```

To use CORS, you must first install the corresponding package. You can install the [cors](https://www.npmjs.com/package/cors) package for both Express and Lungo frameworks. Furthermore, you can also pass CORS options:

```ts
import { ExpressAdapter, ScorpiFactory } from 'scorpi'

async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    cors: {
      // options from cors documentation
    }
  })
  await app.listen(3000)
}

bootstrap()
```

# Using middlewares

Scorpi enables you to use any existing Express or Lungo middleware, or create your own custom middleware. Both frameworks offer a middleware interface for creating your own middlewares, and you can use the `@Use()` decorator to make use of existing middlewares.

## Use existing middleware

There are several ways to implement middleware. For instance, let's attempt to use the [helmet](https://www.npmjs.com/package/helmet) middleware as an example.

1. Install helmet middleware: `npm install helmet`

2. To use middleware per-action:

   ```ts
   import helmet from 'helmet'
   import { Controller, Get, Use } from 'scorpi'

   @Controller('/users')
   export class UserController {
     @Get('/')
     @Use(helmet())
     public index(): void {
       // ...
     }
   }
   ```

   By doing so, the `helmet` middleware will only be applied to the `index` controller action and executed before the action itself.

3. To use middleware per-controller:

   ```ts
   import helmet from 'helmet'
   import { Controller, Use } from 'scorpi'

   @Controller('/users')
   @Use(helmet())
   export class UserController {
     // ...
   }
   ```

   By doing so, the `helmet` middleware will be applied to all actions of the UserController and executed before each action.

4. If you want to use the `helmet` module globally for all controllers, you can easily register it during the bootstrap process.

   ```ts
   import helmet from 'helmet'
   import { ExpressAdapter, ScorpiFactory } from 'scorpi'
   import { UserController } from './user.controller'

   async function bootstrap(): Promise<void> {
     const app = await ScorpiFactory.create(ExpressAdapter, {
       controllers: [UserController],
       middlewares: [helmet()]
     })
     await app.listen(3000)
   }

   bootstrap()
   ```

   Alternatively, you can create a custom [global middleware](#global-middlewares) and simply delegate its execution to the `helmet` module.

## Creating your own middlewares

Here's an example of how to create middleware:

```ts
import { ExpressMiddleware } from 'scorpi'

class CustomMiddleware implements ExpressMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    console.log('Hello from our custom middleware!')
    next()
  }
}
```

> Note: If you are working with Lungo you can use the `LungoMiddleware` interface instead of the `ExpressMiddleware` interface.

Then you can use them this way:

```ts
@Controller('/users')
@Use(CustomMiddleware)
export class UserController {
  // ...
}
```

or per-action:

```ts
@Controller('/users')
export class UserController {
  @Get('/')
  @Use(CustomMiddleware)
  public index(): void {
    // ...
  }
}
```

## Global middlewares

Global middlewares always run before each request. To make your middleware global, you must register it during the bootstrap process.

```ts
import { ExpressMiddleware } from 'scorpi'

class CustomMiddleware implements ExpressMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    console.log('Hello from our global middleware!')
    next()
  }
}
```

You can enable your custom middleware by registering it during the bootstrap process.

```ts
async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    middlewares: [CustomMiddleware]
  })
  await app.listen(3000)
}

bootstrap()
```

## Exception handlers

By default, Scorpi uses the default exception handler of its underlying framework. However, it is also easy to create your own custom exception handler middleware like that:

```ts
class CustomExceptionHandler implements ExpressExceptionHandler {
  public catch(exception: HttpException, req: Request, res: Response): void {
    if (exception instanceof Error) {
      throw exception
    } else {
      throw new InternalServerErrorException()
    }
  }
}
```

> Note: If you are working with Lungo you can use the `LungoExceptionHandler` interface instead of the `ExpressExceptionHandler` interface.

You should then register your custom error handler with Scorpi during the bootstrapping process.

```ts
async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    exceptionHandler: CustomExceptionHandler
  })
  await app.listen(3000)
}

bootstrap()
```

# Creating instances of classes from action params

Scorpi provides a built-in feature using [class-transformer](https://github.com/typestack/class-transformer) that allows you to parse a JSON object into an object of a specific class, instead of a simple literal object. Note that this feature is enabled by default, but can be disabled by setting the `useClassTransformer` option to `false` during application bootstrap.

If you specify a class when parsing your action parameters, Scorpi will create an instance of that class using the data sent by the user.

```ts
class User {
  private firstName!: string
  private lastName!: string

  public getName(): string {
    return this.lastName + ' ' + this.firstName
  }
}

@Controller('/users')
export class UserController {
  @Post('/')
  public create(@Body() user: User): void {
    console.log('Creating user: ' + user.getName())
  }
}
```

# Auto validating action params

Converting a JSON object into an instance of a class may not always be sufficient. For example, if you rely on TypeScript's type safety, you may encounter runtime errors because [class-transformer](https://github.com/typestack/class-transformer) doesn't verify the property types. Additionally, you may want to validate the object to ensure that the password is long enough or that the entered email is valid.

Fortunately, this can be easily accomplished through integration with [class-validator](https://github.com/typestack/class-validator), which is enabled by default. If you want to turn off this feature, you need to explicitly disable it during application bootstrap by passing the `useValidation: false` option:

```ts
async function bootstrap(): Promise<void> {
  const app = await ScorpiFactory.create(ExpressAdapter, {
    useValidation: false
  })
  await app.listen(3000)
}

bootstrap()
```

Next, you'll need to define a class that will be used as the type for the controller's method parameter. Make sure to decorate the class's properties with the appropriate validation decorators.

```ts
import { IsEmail, MinLength } from 'class-validator'

export class User {
  @IsEmail()
  public email!: string

  @MinLength(6)
  public password!: string
}
```

If you're not familiar with class-validator and its decorators, you can learn more about using them for handling complex object validation [here](https://github.com/typestack/class-validator).

Now, if you have specified a class type for your action parameters, the received data from the user will not only be converted into an instance of that class but also validated. This means that you won't have to manually check each property in the controller method body for issues such as incorrect email or too short a password.

```ts
@Controller('/users')
export class UserController {
  @Post('/')
  public create(@Body() user: User): void {
    console.log(`We can now be sure that the password is 6 characters or longer: ${user.password}`)
    console.log(`We can now be sure that the email is in a valid email format: ${user.email}`)
  }
}
```

If the received parameter does not meet the requirements specified by the [class-validator](https://github.com/typestack/class-validator) decorators, an error will be thrown and handled by Scorpi. As a result, the client will receive a 400 Bad Request response along with a detailed JSON array of validation errors.

This technique works not only with `@Body()` but also with `@Params()`, `@Query()`, `@Cookies()` decorators.

# Using dependency injection

Scorpi uses [MagnoDI](https://github.com/canccevik/magnodi) as its built-in DI container and exposes it to users. You can use this container to inject your services into your controllers, middlewares, and error handlers.

Let's take a look at how to use it by creating a service:

```ts
import { Injectable } from 'scorpi'

@Injectable()
export class LoggerService {
  public log(message: string): void {
    console.log(message)
  }
}
```

> Note: To register our class with the container, we need to mark it with the `@Injectable()` decorator.

Afterwards, let's inject this service into our controller:

```ts
@Controller('/users')
export class UserController {
  constructor(private readonly loggerService: LoggerService) {}

  // controller actions...
}
```

# Contributing

1. Fork this repository.
2. Create a new branch with feature name.
3. Create your feature.
4. Commit and set commit message with feature name.
5. Push your code to your fork repository.
6. Create pull request.

# License

Scorpi is [MIT licensed](https://github.com/canccevik/scorpi/blob/master/LICENSE).
