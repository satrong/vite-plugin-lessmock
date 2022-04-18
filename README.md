# vite-plugin-lessmock

A vite plugin that auto generate mock data with fake data for TypeScript interfaces.

## Install

```bash
npm install vite-plugin-lessmock
```

## Usage

_vite.config.ts_:
```ts
import { defineConfig } from 'vite'
import lessMock from 'vite-plugin-lessmock'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    lessMock({
      apiPrefix: '/api/mock/',
      mockDir: resolve('mock') 
    })
  ]
})
```

## Options

```ts
lessMock(options)

type TOptions = {
  /**
   * The directory to search for mock files.
   */
  mockDir: string;
  /**
   * Intercept api requests based on this prefix
   */
  apiPrefix: string;
  /**
   * @default TLessMock
   */
  useType?: string;
}
```

## Request match file

Project structure:
```text
- my_project
  - mock
    - #a#b.get.ts
    - #a#c.post.ts
    - a
      - #d#e.get.ts
```

- URL `/a/b` with `GET` method will match _my_project/mock/#a#b.get.ts_ file.
- URL `/a/c` with `POST` method will match _my_project/mock/#a#c.post.ts_ file.
- URL `/a/d/e` with `GET` method will match _my_project/mock/a/#d#e.get.ts_ file.

> Warn: make sure `.get.ts` `.post.ts` is lower case, and file and directory name is case sensitive.

## Example

_#a#b.get.ts_ file's code:
```ts
type ReturnType<T> = {
  success: 200 | 201 | 204;
  data: T;
  msg: string;
}

export type TLessMock = ReturnType<{
  id: number;
  /**
   * @format faker.name.firstName()
   */
  name: string;
  /**
   * @maximum 100
   * @minimum 1
   */
  age: number;
  status: boolean;
}>
```

The response content that you request `/a/b` will be like blew:

```json
{
  "success": 204,
  "data": {
    "id": 42365,
    "name": "Cecil",
    "age": 23,
    "status": false
  },
  "msg": "Illo deleniti fuga inventore asperiores tempora."
}
```
