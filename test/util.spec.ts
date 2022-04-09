import { describe, test, expect } from 'vitest'
import { resolve, join } from 'path'
import { findFile } from '../src/util'

const rootDir = resolve('test/findFile')
const testCases = [
  ['get', '/a/b', join(rootDir, '#a#b.get.ts')],
  ['get', '/a/c', join(rootDir, '/a/#c.get.ts')]
]

describe('findFile', () => {
  testCases.forEach(([method, path, result]) => {
    test(`${method} ${path}`, async () => {
      const filepath = await findFile(rootDir, path, method)
      expect(filepath).toBe(result)
    })
  })
})
