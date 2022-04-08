import { createGenerator } from 'ts-json-schema-generator'
import type { Schema, Config } from 'ts-json-schema-generator'
import { faker } from '@faker-js/faker'
import _ from 'lodash'

export class GenerateMock {
  private USE_TYPE = 'TLessMock'
  private filepath: string
  private schema: Schema | null

  constructor (tsFilepath: string) {
    this.filepath = tsFilepath
    this.schema = this.getJsonSchema()
  }

  generate<T = any> (): T | null {
    if (this.schema === null) return null
    const data = this.schema.definitions![this.USE_TYPE]
    if (typeof data === 'object') {
      return this.parse(data)
    }
    return null
  }

  getJsonSchema () {
    if (this.schema === null) return null
    if (this.schema) return this.schema

    const config: Config = {
      path: this.filepath,
      type: this.USE_TYPE,
      skipTypeCheck: true
    }

    try {
      const d = createGenerator(config).createSchema(config.type)
      return d
    } catch (err) {
      return null
    }
  }

  private parseObjectType (schema: Schema) {
    const data: Record<string, any> = {}
    const required = schema.required || []
    Object.entries(schema.properties || {}).forEach(([field, value]) => {
      if (required.includes(field) || faker.datatype.boolean()) {
        data[field] = this.parse(value)
      }
    })
    return data
  }

  private parseArrayType (schema: Schema) {
    if (!_.isObject(schema.items)) return null

    return new Array(schema.maxItems || schema.maxLength || 1).fill(null).map(() => {
      return this.parse(schema.items as Schema)
    })
  }

  private parseOtherType (schema: Schema) {
    const type = schema.type

    if (schema.anyOf) {
      const d = faker.random.arrayElement(schema.anyOf!)
      return this.parse(d)
    }

    if (schema.const !== undefined) {
      return schema.const
    }

    if (schema.enum) {
      return faker.random.arrayElement(schema.enum)
    }

    if (schema.format) {
      return _.get(faker, schema.format)()
    }

    if (type === 'string') {
      const s = faker.lorem.sentences(1)
      const len = schema.maxLength === undefined ? s.length : schema.maxLength
      return s.slice(0, len)
    }

    if (type === 'number') {
      const { maximum, minimum } = schema
      return faker.datatype.number({ max: maximum, min: minimum })
    }

    if (type === 'boolean') {
      return faker.datatype.boolean()
    }

    return null
  }

  private unref (schema: Schema | boolean) {
    if (_.isObject(schema) && schema.type === undefined && schema.$ref) {
      const key = schema.$ref.replace('#/definitions/', '')
      const rest = _.omit(schema, '$ref')
      const newSchema = this.schema!.definitions![decodeURIComponent(key)]
      return Object.assign(rest, newSchema)
    }
    return schema
  }

  private parse (data: Schema | boolean) {
    let mock: any
    data = this.unref(data)

    if (typeof data === 'object') {
      switch (data.type) {
        case 'object':
          mock = this.parseObjectType(data)
          break
        case 'array':
          mock = this.parseArrayType(data)
          break
        default:
          mock = this.parseOtherType(data)
      }
    }
    return mock
  }
}
