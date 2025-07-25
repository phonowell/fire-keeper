import { wrapList } from '../src/index.js'

const a = () => {
  const question = ['a', 'b', 'c']
  const answer = "'a', 'b', 'c'"
  if (wrapList(question) !== answer) throw new Error('string array failed')
}
a.description = 'wraps string array'

const b = () => {
  const tests = [
    ['hello', "'hello'"],
    [123, "'123'"],
    [true, "'true'"],
    [false, "'false'"],
  ] as const

  for (const [input, expected] of tests) {
    const result = wrapList(input)
    if (result !== expected) {
      throw new Error(
        `primitive ${typeof input} failed. Expected: ${expected}, Got: ${result}`,
      )
    }
  }
}
b.description = 'wraps primitive values'

const c = () => {
  const input = ['hello', 42, true, false]
  const expected = "'hello', '42', 'true', 'false'"
  if (wrapList(input) !== expected) throw new Error('mixed primitives failed')
}
c.description = 'wraps mixed primitives'

const d = () => {
  type TestObj = {
    name: string
    value: number
  }
  const input = { name: 'test', value: 42 }

  const result = wrapList(input)

  if (!result.startsWith("'") || !result.endsWith("'"))
    throw new Error('object quote wrapping failed')

  const inner = JSON.parse(result.slice(1, -1)) as TestObj
  if (inner.name !== 'test' || inner.value !== 42)
    throw new Error('object structure failed')
}
d.description = 'wraps objects'

const e = () => {
  type TestObj = {
    id: number
    name: string
  }
  const input = [
    { id: 1, name: 'first' },
    { id: 2, name: 'second' },
  ]
  const result = wrapList(input)

  const parts = result
    .split(', ')
    .map((part) => JSON.parse(part.slice(1, -1)) as TestObj)

  if (parts.length !== 2) throw new Error('object array length wrong')
  if (parts[0].id !== 1 || parts[1].id !== 2)
    throw new Error('object array content wrong')
}
e.description = 'wraps array of objects'

const f = () => {
  type FalsyTest = [null | undefined | string | boolean | unknown[], string]
  const tests: FalsyTest[] = [
    [null, ''],
    [undefined, ''],
    ['', "''"],
    [[], ''],
    [false, "'false'"],
  ]

  for (const [input, expected] of tests) {
    const result = wrapList(input)
    if (result !== expected) {
      throw new Error(
        `falsy value ${String(input)} failed. Expected: ${expected}, Got: ${result}`,
      )
    }
  }
}
f.description = 'handles falsy values'

const g = () => {
  const input = ["It's", 'a "quote"', '\\backslash\\']
  const result = wrapList(input)

  const parts = result.split(', ').map((part) => part.slice(1, -1))

  if (parts[0] !== "It's") throw new Error('single quote handling failed')
  if (parts[1] !== 'a "quote"') throw new Error('double quote handling failed')
  if (parts[2] !== '\\backslash\\') throw new Error('backslash handling failed')
}
g.description = 'handles special characters'

const h = () => {
  type NestedObj = {
    nested: {
      deep: boolean
    }
  }
  type NestedItem = number[] | NestedObj

  const input = [[1, 2], { nested: { deep: true } }]
  const result = wrapList(input)
  const parts = result
    .split(', ')
    .map((part) => JSON.parse(part.slice(1, -1)) as NestedItem)

  const [arr, obj] = parts
  if (!Array.isArray(arr) || arr.join(',') !== '1,2')
    throw new Error('nested array failed')
  if (!('nested' in obj) || !obj.nested.deep)
    throw new Error('nested object failed')
}
h.description = 'handles nested structures'

const i = () => {
  const input = ['你好', '世界', '🌍']
  const expected = "'你好', '世界', '🌍'"
  if (wrapList(input) !== expected) throw new Error('unicode characters failed')
}
i.description = 'handles unicode characters'

const j = () => {
  const input = Array.from({ length: 1000 }, (_, i) => i)
  const result = wrapList(input)
  if (!result.startsWith("'0'") || !result.endsWith("'999'"))
    throw new Error('long array failed')

  const commaCount = result.match(/,/g)?.length ?? 0
  if (commaCount !== 999) throw new Error('long array separator count wrong')
}
j.description = 'handles long arrays'

const k = () => {
  type ComplexTypes = (
    | number
    | string
    | Record<string, boolean>
    | number[]
    | Date
    | RegExp
    | null
    | undefined
  )[]
  const input: ComplexTypes = [
    42,
    'string',
    { test: true },
    [1, 2, 3],
    new Date('2024-01-01'),
    /regex/,
    null,
    undefined,
  ]

  const result = wrapList(input)
  const parts = result.split(', ').filter(Boolean)

  if (!parts[0].includes('42')) throw new Error('number conversion failed')
  if (!parts[1].includes('string')) throw new Error('string conversion failed')
  if (!parts[2].includes('test')) throw new Error('object conversion failed')
  if (!parts[3].includes('[1,2,3]')) throw new Error('array conversion failed')
}
k.description = 'handles complex mixed types'

export { a, b, c, d, e, f, g, h, i, j, k }
