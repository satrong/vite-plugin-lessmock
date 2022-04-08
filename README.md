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

## Demo
Project structure:
```text
- my_project
  - mock
    - #a#b.get.ts
    - #a#c.post.ts 
```

_#a#b.get.ts_:
```ts
type ReturnType<T> = {
  success: 200 | 201 | 204;
  data: T;
  msg: string;
}

export type TLessMock = ReturnType<{
  id: number;
  /**
   * @format name.firstName
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
