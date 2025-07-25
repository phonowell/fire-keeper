import { isEqual } from 'radash'

import { at } from '../src/index.js'

const a = () => {
  const question = [1, 2, 3]
  const answer = 2
  if (!isEqual(at(question, 1), answer))
    throw new Error('positive index failed')
}
a.description = 'handles positive array indices'

const b = () => {
  const question = [1, 2, 3]
  const answer = 3
  if (!isEqual(at(question, -1), answer))
    throw new Error('negative index failed')
}
b.description = 'handles negative array indices'

const c = () => {
  const question = [1, 2, 3]
  if (at(question, 3) !== undefined)
    throw new Error('out of bounds not undefined')
  if (at(question, -4) !== undefined)
    throw new Error('negative out of bounds not undefined')
}
c.description = 'handles out of bounds indices'

const d = () => {
  const question = { a: 1, b: 2, c: 3 }
  const answer = 2
  if (!isEqual(at(question, 'b'), answer))
    throw new Error('object key access failed')
}
d.description = 'handles object key access'

const e = () => {
  const question = { a: 1, b: 2, c: 3 }
  if (at(question, 'd') !== undefined)
    throw new Error('non-existent key not undefined')
}
e.description = 'handles non-existent keys'

const f = () => {
  type TestObj = {
    id: number
    name: string
  }
  const arr: TestObj[] = [
    { id: 1, name: 'first' },
    { id: 2, name: 'second' },
  ]
  const obj: Record<string, TestObj> = {
    a: { id: 1, name: 'first' },
    b: { id: 2, name: 'second' },
  }

  const arrResult = at(arr, 1)
  const objResult = at(obj, 'b')

  if (arrResult?.id !== 2 || arrResult.name !== 'second')
    throw new Error('array complex object failed')
  if (objResult?.id !== 2 || objResult.name !== 'second')
    throw new Error('object complex object failed')
}
f.description = 'handles complex objects'

const g = () => {
  const emptyArr: number[] = []
  const emptyObj: Record<string, number> = {}

  if (at(emptyArr, 0) !== undefined)
    throw new Error('empty array access failed')
  if (at(emptyObj, 'key') !== undefined)
    throw new Error('empty object access failed')
}
g.description = 'handles empty containers'

const h = () => {
  const arr = [null, undefined, NaN]
  const obj = { a: null, b: undefined, c: NaN }

  if (at(arr, 0) !== null) throw new Error('null in array failed')
  if (at(arr, 1) !== undefined) throw new Error('undefined in array failed')
  if (!Number.isNaN(at(arr, 2))) throw new Error('NaN in array failed')

  if (at(obj, 'a') !== null) throw new Error('null in object failed')
  if (at(obj, 'b') !== undefined) throw new Error('undefined in object failed')
  if (!Number.isNaN(at(obj, 'c'))) throw new Error('NaN in object failed')
}
h.description = 'handles special values'

const i = () => {
  const arr = [1, 'two', true, { four: 4 }]
  const obj = { a: 1, b: 'two', c: true, d: { four: 4 } }

  if (typeof at(arr, 0) !== 'number') throw new Error('number type failed')
  if (typeof at(arr, 1) !== 'string') throw new Error('string type failed')
  if (typeof at(arr, 2) !== 'boolean') throw new Error('boolean type failed')
  if (typeof at(arr, 3) !== 'object') throw new Error('object type failed')

  if (typeof at(obj, 'a') !== 'number') throw new Error('number key failed')
  if (typeof at(obj, 'b') !== 'string') throw new Error('string key failed')
  if (typeof at(obj, 'c') !== 'boolean') throw new Error('boolean key failed')
  if (typeof at(obj, 'd') !== 'object') throw new Error('object key failed')
}
i.description = 'preserves types'

const j = () => {
  const arr = [
    [1, 2],
    [3, [4, 5]],
  ]
  const obj = {
    a: { b: { c: 1 } },
    d: [{ e: 2 }],
  }

  const nestedArr = at(arr, 1)
  if (!Array.isArray(nestedArr) || !isEqual(nestedArr, [3, [4, 5]]))
    throw new Error('nested array access failed')

  const nestedObj = at(obj, 'a')
  if (!nestedObj || !isEqual(nestedObj, { b: { c: 1 } }))
    throw new Error('nested object access failed')
}
j.description = 'handles nested structures'

const k = () => {
  const obj = { '0': 'zero', '1': 'one', '-1': 'negative' }

  if (at(obj, '0') !== 'zero') throw new Error('numeric key failed')
  if (at(obj, '1') !== 'one') throw new Error('numeric key failed')
  if (at(obj, '-1') !== 'negative')
    throw new Error('negative numeric key failed')
}
k.description = 'handles numeric object keys'

const l = () => {
  const obj = { a: { b: { c: 1 } } }

  if (at(obj, 'a.b.c') !== 1)
    throw new Error('deep property access with dot notation failed')
  if (at(obj, 'a.b.d') !== undefined)
    throw new Error('non-existent deep property should return undefined')
}
l.description = 'handles deep property access with dot notation'

const m = () => {
  const obj = { a: { b: { c: 1 } } }

  if (at(obj, 'a', 'b', 'c') !== 1)
    throw new Error('deep property access with multiple arguments failed')
  if (at(obj, 'a', 'b', 'd') !== undefined) {
    throw new Error(
      'non-existent deep property with multiple arguments should return undefined',
    )
  }
}
m.description = 'handles deep property access with multiple arguments'

const n = () => {
  const obj = { a: { b: { c: { d: 1 } } } }

  if (at(obj, 'a.b', 'c.d') !== 1)
    throw new Error('mixed property access styles failed')
  if (at(obj, 'a', 'b.c.d') !== 1)
    throw new Error('mixed property access styles alternative failed')
}
n.description = 'handles mixed property access styles'

export { a, b, c, d, e, f, g, h, i, j, k, l, m, n }
