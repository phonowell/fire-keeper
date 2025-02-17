import { isEqual } from 'radash'

import { $ } from './index'

const a = (): void => {
  const question = [1, 2, 3, 4, 5]
  const answer = 2
  if (
    !isEqual(
      $.findIndex(question, x => x === 3),
      answer,
    )
  )
    throw Error('simple find failed')
}
a.description = 'finds element and returns correct index'

const b = (): void => {
  const question = [1, 2, 3, 4, 5]
  const answer = -1
  if (
    !isEqual(
      $.findIndex(question, x => x === 6),
      answer,
    )
  )
    throw Error('not found case failed')
}
b.description = 'returns -1 when element not found'

const c = (): void => {
  const question = [1, 2, 3, 4, 5]
  const answer = 0
  if (
    !isEqual(
      $.findIndex(question, (_, i) => i === 0),
      answer,
    )
  )
    throw Error('index parameter failed')
}
c.description = 'callback receives correct index parameter'

const d = (): void => {
  const question = [1, 2, 3]
  const answer = 1
  if (
    !isEqual(
      $.findIndex(question, (_, i, arr) => arr[i] === 2),
      answer,
    )
  )
    throw Error('array parameter failed')
}
d.description = 'callback receives correct array parameter'

const e = (): void => {
  const question: number[] = []
  const answer = -1
  if (
    !isEqual(
      $.findIndex(question, x => x === 1),
      answer,
    )
  )
    throw Error('empty array failed')
}
e.description = 'returns -1 for empty array'

const f = (): void => {
  // Test with object array
  type TestObject = {
    id: number
    value: string
  }
  const question: TestObject[] = [
    { id: 1, value: 'one' },
    { id: 2, value: 'two' },
    { id: 3, value: 'three' },
  ]
  const answer = 1
  if (
    !isEqual(
      $.findIndex(question, x => x.value === 'two'),
      answer,
    )
  )
    throw Error('object array find failed')
}
f.description = 'finds in object array'

const g = (): void => {
  // Test with multiple conditions
  const question = [1, 2, 3, 4, 5]
  const answer = 3
  if (
    !isEqual(
      $.findIndex(question, x => x > 3 && x % 2 === 0),
      answer,
    )
  )
    throw Error('multiple conditions failed')
}
g.description = 'handles multiple conditions'

const h = (): void => {
  // Test with null/undefined values
  const question = [0, null, undefined, 1, null]
  const answer = 2
  if (
    !isEqual(
      $.findIndex(question, x => x === undefined),
      answer,
    )
  )
    throw Error('null/undefined find failed')
}
h.description = 'handles null and undefined'

const i = (): void => {
  // Test with closure variable
  let count = 0
  const question = [1, 2, 3]
  $.findIndex(question, x => {
    count++
    return x === 2
  })
  if (count !== 2) throw Error('callback execution count wrong')
}
i.description = 'handles closure variables'

const j = (): void => {
  // Test type-safe interface
  type TypedItem = {
    readonly id: number
    readonly name: string
  }
  const items: TypedItem[] = [
    { id: 1, name: 'first' },
    { id: 2, name: 'second' },
  ]
  const result = $.findIndex(items, (item): item is TypedItem => item.id === 2)
  if (result !== 1) throw Error('typed find failed')
}
j.description = 'works with type predicates'

const k = (): void => {
  // Test performance with large array
  const size = 10000
  const question = Array.from({ length: size }, (_, i) => i)
  const start = Date.now()
  const result = $.findIndex(question, x => x === size - 1)
  const duration = Date.now() - start

  if (result !== size - 1) throw Error('large array find failed')
  if (duration > 1000) throw Error('performance test took too long')
}
k.description = 'handles large arrays efficiently'

const l = (): void => {
  // Test that findIndex maintains correct behavior even with array modifications
  const question = [1, 2, 3]
  const result = $.findIndex(question, (x, i, arr) => {
    // Only modify after we've found our target
    if (x === 2) {
      arr[i + 1] = 10 // This shouldn't affect the result
      return true
    }
    return false
  })

  if (result !== 1)
    throw Error('findIndex should return correct index despite array mutations')
  if (question[2] !== 3) throw Error('original array should not be modified')
}
l.description = 'maintains correct behavior with array modifications'

export { a, b, c, d, e, f, g, h, i, j, k, l }
