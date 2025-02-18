import { isEqual } from 'radash'

import { toArray } from '../src'

const a = () => {
  const question = 'test/a'
  const answer = ['test/a']
  if (!isEqual(toArray(question), answer))
    throw new Error('string conversion failed')
}
a.description = 'converts string to array'

const b = () => {
  const question = ['test/b']
  const answer = ['test/b']
  if (!isEqual(toArray(question), answer))
    throw new Error('array passthrough failed')
}
b.description = 'preserves existing array'

const c = () => {
  type TestCase<T> = [T, T[]]
  const tests: TestCase<number | boolean | null | undefined | bigint>[] = [
    [42, [42]],
    [true, [true]],
    [null, [null]],
    [undefined, [undefined]],
    [BigInt(9007199254740991), [BigInt(9007199254740991)]],
  ]

  // 单独测试 Symbol
  const sym = Symbol('test')
  const symResult = toArray(sym)
  if (symResult.length !== 1 || typeof symResult[0] !== 'symbol') {
    throw new Error('primitive conversion failed for Symbol')
  }

  // 测试其他基本类型
  for (const [input, expected] of tests) {
    const result = toArray(input)
    if (!isEqual(result, expected))
      throw new Error(`primitive conversion failed for ${String(input)}`)
  }
}
c.description = 'handles primitive types'

const d = () => {
  // Test mixed type arrays
  const arr = [1, 'two', true, { four: 4 }]
  const result = toArray(arr)
  if (!isEqual(result, arr)) throw new Error('mixed type array handling failed')
}
d.description = 'handles mixed type arrays'

const e = () => {
  // Test object conversion
  const obj = { key: 'value' }
  const result = toArray(obj)
  if (!isEqual(result, [obj])) throw new Error('object conversion failed')
}
e.description = 'converts objects'

const f = () => {
  // Test type preservation with interface
  type TestType = {
    id: number
    name: string
  }
  const item: TestType = { id: 1, name: 'test' }
  const result = toArray<TestType>(item)

  if (result.length !== 1) throw new Error('array length wrong')
  if (result[0].id !== 1 || result[0].name !== 'test')
    throw new Error('type preservation failed')
}
f.description = 'preserves types'

const g = () => {
  // Test empty array
  const arr: never[] = []
  const result = toArray(arr)
  if (!isEqual(result, [])) throw new Error('empty array handling failed')
}
g.description = 'handles empty arrays'

const h = () => {
  // Test array-like objects
  const arrayLike = { 0: 'first', 1: 'second', length: 2 }
  const result = toArray(arrayLike)
  if (!isEqual(result, [arrayLike]))
    throw new Error('array-like object conversion failed')
}
h.description = 'handles array-like objects'

const i = () => {
  // Test nested structures
  const nested = [1, [2, 3], [4, [5, 6]]]
  const result = toArray(nested)
  if (!isEqual(result, nested)) throw new Error('nested array handling failed')
}
i.description = 'preserves nested structures'

const j = () => {
  // Test with complex objects
  class TestClass {
    value: string
    constructor(value: string) {
      this.value = value
    }
  }
  const instance = new TestClass('test')
  const result = toArray(instance)

  if (!(result[0] instanceof TestClass))
    throw new Error('class instance preservation failed')
  if (result[0].value !== 'test')
    throw new Error('class property preservation failed')
}
j.description = 'handles class instances'

const k = () => {
  // Test Set and Map conversion
  const set = new Set([1, 2, 3])
  const map = new Map([['key', 'value']])

  const setResult = toArray(set)
  const mapResult = toArray(map)

  if (!isEqual(setResult, [set])) throw new Error('Set conversion failed')
  if (!isEqual(mapResult, [map])) throw new Error('Map conversion failed')
}
k.description = 'handles built-in objects'

const l = () => {
  // Test array subclasses
  class CustomArray<T> extends Array<T> {}
  const customArr = new CustomArray<number>()
  customArr.push(1, 2, 3)
  const result = toArray(customArr)

  // Should treat CustomArray as an array
  if (!isEqual(result, [1, 2, 3]))
    throw new Error('array subclass handling failed')
}
l.description = 'handles array subclasses'

export { a, b, c, d, e, f, g, h, i, j, k, l }
