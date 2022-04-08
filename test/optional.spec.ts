import { resolve } from 'path'
import { describe, test, expect } from 'vitest'
import { GenerateMock } from '../src/generateMock'
import { TsMockType } from './fixtures/optional'

describe('optional', () => {
  test('check optional filed', () => {
    const generateMock = new GenerateMock(resolve('test/fixtures/optional.ts'))
    const result = generateMock.generate<TsMockType>()!

    expect(result.friends.length).toBe(20)
    expect(result.friends.filter(item => item.age).length).lessThan(20)
  })
})
