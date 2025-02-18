import { wrapList } from '../src'

const a = () => {
  const question = ['a', 'b', 'c']
  const answer = "'a', 'b', 'c'"
  if (wrapList(question) !== answer) throw new Error('string array failed')
}
a.description = 'wraps string array'

const b = () => {
  // Test single primitive values
  const tests = [
    ['hello', "'hello'"],
    [123, "'123'"],
    [true, "'true'"],
    [false, "'false'"], // wrap in array to avoid falsy check
  ] as const

  for (const [input, expected] of tests) {
    const result = wrapList(input)
    if (result !== expected)
      throw new Error(
        `primitive ${typeof input} failed. Expected: ${expected}, Got: ${result}`,
      )
  }
}
b.description = 'wraps primitive values'

const c = () => {
  // Test arrays of mixed primitives
  const input = ['hello', 42, true, false]
  const expected = "'hello', '42', 'true', 'false'"
  if (wrapList(input) !== expected) throw new Error('mixed primitives failed')
}
c.description = 'wraps mixed primitives'

const d = () => {
  // Test objects
  type TestObj = {
    name: string
    value: number
  }
  const input = { name: 'test', value: 42 }
  // Let wrapList handle the JSON stringification
  const result = wrapList(input)
  // Verify it's a string wrapped in quotes containing JSON
  if (!result.startsWith("'") || !result.endsWith("'"))
    throw new Error('object quote wrapping failed')

  // Parse the inner JSON to verify structure
  const inner = JSON.parse(result.slice(1, -1)) as TestObj
  if (inner.name !== 'test' || inner.value !== 42)
    throw new Error('object structure failed')
}
d.description = 'wraps objects'

const e = () => {
  // Test array of objects
  type TestObj = {
    id: number
    name: string
  }
  const input = [
    { id: 1, name: 'first' },
    { id: 2, name: 'second' },
  ]
  const result = wrapList(input)

  // Split and parse each object to verify
  const parts = result
    .split(', ')
    .map(part => JSON.parse(part.slice(1, -1)) as TestObj)

  if (parts.length !== 2) throw new Error('object array length wrong')
  if (parts[0].id !== 1 || parts[1].id !== 2)
    throw new Error('object array content wrong')
}
e.description = 'wraps array of objects'

const f = () => {
  // Test falsy values
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
    if (result !== expected)
      throw new Error(
        `falsy value ${String(input)} failed. Expected: ${expected}, Got: ${result}`,
      )
  }
}
f.description = 'handles falsy values'

const g = () => {
  // Test special characters
  const input = ["It's", 'a "quote"', '\\backslash\\']
  const result = wrapList(input)
  // Verify each part is properly wrapped and preserved
  const parts = result.split(', ').map(part => part.slice(1, -1))

  if (parts[0] !== "It's") throw new Error('single quote handling failed')
  if (parts[1] !== 'a "quote"') throw new Error('double quote handling failed')
  if (parts[2] !== '\\backslash\\') throw new Error('backslash handling failed')
}
g.description = 'handles special characters'

const h = () => {
  // Test nested structures
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
    .map(part => JSON.parse(part.slice(1, -1)) as NestedItem)

  const [arr, obj] = parts
  if (!Array.isArray(arr) || arr.join(',') !== '1,2')
    throw new Error('nested array failed')
  if (!('nested' in obj) || !obj.nested.deep)
    throw new Error('nested object failed')
}
h.description = 'handles nested structures'

const i = () => {
  // Test unicode characters
  const input = ['你好', '世界', '🌍']
  const expected = "'你好', '世界', '🌍'"
  if (wrapList(input) !== expected) throw new Error('unicode characters failed')
}
i.description = 'handles unicode characters'

const j = () => {
  // Test very long array
  const input = Array.from({ length: 1000 }, (_, i) => i)
  const result = wrapList(input)
  if (!result.startsWith("'0'") || !result.endsWith("'999'"))
    throw new Error('long array failed')

  const commaCount = result.match(/,/g)?.length ?? 0
  if (commaCount !== 999) throw new Error('long array separator count wrong')
}
j.description = 'handles long arrays'

const k = () => {
  // Test complex mixed types
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

  // Verify each type is handled
  if (!parts[0].includes('42')) throw new Error('number conversion failed')
  if (!parts[1].includes('string')) throw new Error('string conversion failed')
  if (!parts[2].includes('test')) throw new Error('object conversion failed')
  if (!parts[3].includes('[1,2,3]')) throw new Error('array conversion failed')
}
k.description = 'handles complex mixed types'

export { a, b, c, d, e, f, g, h, i, j, k }
