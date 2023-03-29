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
  - [Prefix all controllers routes](#prefix-all-controllers-routes)
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

3. Set this options in `tsconfig.json` file of your project:

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

You can return promises in your controller. Scorpi will wait until promise resolved and return promise result in the reponse body.

```ts
import { Body, Controller, Get, Params, Post } from 'scorpi'

@Controller('/users')
export class UserController {
  @Get('/')
  public getAll(): Promise<User[]> {
    return userRepository.findAll()
  }

  @Get('/:id')
  public getById(@Params('id') id: number): Promise<User> {
    return userRepository.findById(id)
  }

  @Post('/')
  public create(@Body() user: User): Promise<User> {
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

## Prefix all controllers routes

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

# Contributing

1. Fork this repository.
2. Create a new branch with feature name.
3. Create your feature.
4. Commit and set commit message with feature name.
5. Push your code to your fork repository.
6. Create pull request.

# License

Scorpi is [MIT licensed](https://github.com/canccevik/scorpi/blob/master/LICENSE).
