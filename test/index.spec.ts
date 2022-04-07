import { describe, test, expect } from 'vitest'
import path from 'path'
import { GenerateMock } from '../src/index'

describe('base', () => {
  const generateMock = new GenerateMock(path.join(__dirname, './fixtures/base.ts'))
  const result = generateMock.generateMock()

  test('check property', () => {
    expect(result).toHaveProperty('method')
    expect(result).toHaveProperty('path')
    expect(result).toHaveProperty('data')
  })

  test('check values', () => {
    expect(result.method).toMatchInlineSnapshot('"get"')
    expect(result.path).toMatchInlineSnapshot('"/a/b"')
    expect(typeof result.data).toEqual('object')
  })

  test('check data type', () => {
    expect(typeof result.data.msg).toBe('string')
    expect([200, 201, 204]).contain(result.data.success)
    expect(result.data.data.length).toBe(13)
  })

  test('check data.data item property', () => {
    result.data.data.forEach((item: any) => {
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('count')
      expect(item).toHaveProperty('users')
      expect(item).toHaveProperty('tags')

      expect(typeof item.count).toBe('number')
      expect(typeof item.title).toBe('string')
      expect(item.title.length).toBeLessThanOrEqual(10)
      expect(typeof item.sex).toBe('string')

      result.data.data.forEach((el: any) => {
        if (typeof el.tags !== 'number') {
          expect(['admin', 'member', 'guest']).contain(el.tags)
        }

        el.users.forEach((user: any) => {
          expect(typeof user.name).toBe('string')
          expect(user.age).greaterThanOrEqual(1).lessThanOrEqual(100)
        })
      })
    })
  })
})
