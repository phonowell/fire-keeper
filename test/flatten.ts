import { isEqual } from 'radash'

import { flatten } from '../src'

const a = (): void => {
  const question = [1, 2, 3]
  const answer = [1, 2, 3]
  if (!isEqual(flatten(question), answer)) throw Error('flat array failed')
}
a.description = 'returns original array when no nesting'

const b = (): void => {
  const question: (number | number[])[] = [1, [2, 3], 4]
  const answer = [1, 2, 3, 4]
  if (!isEqual(flatten(question), answer))
    throw Error('single level nesting failed')
}
b.description = 'flattens single level array'

const c = (): void => {
  const question: (number | number[])[] = [1, [2], [3, 4], 5]
  const answer = [1, 2, 3, 4, 5]
  if (!isEqual(flatten(question), answer)) throw Error('multiple arrays failed')
}
c.description = 'flattens multiple nested arrays'

const d = (): void => {
  const question: number[] = []
  const answer: number[] = []
  if (!isEqual(flatten(question), answer)) throw Error('empty array failed')
}
d.description = 'handles empty array'

const e = (): void => {
  const question: (number | number[])[] = [1, [], [2], [], [3], 4]
  const answer = [1, 2, 3, 4]
  if (!isEqual(flatten(question), answer))
    throw Error('empty nested arrays failed')
}
e.description = 'handles empty nested arrays'

const f = (): void => {
  // Test deep nesting
  type DeepArray = number | DeepArray[]
  const question: DeepArray[] = [1, [2, [3, [4, [5]]]]]
  const answer = [1, 2, 3, 4, 5]
  if (!isEqual(flatten(question), answer)) throw Error('deep nesting failed')
}
f.description = 'flattens deeply nested arrays'

const g = (): void => {
  // Test mixed types
  type MixedType = string | number | boolean | { key: string }
  type NestedMixed = MixedType | NestedMixed[]
  const obj = { key: 'value' }
  const question: NestedMixed[] = ['string', [1, [true, [obj]]]]
  const answer: MixedType[] = ['string', 1, true, obj]
  if (!isEqual(flatten(question), answer)) throw Error('mixed types failed')
}
g.description = 'handles mixed content types'

const h = (): void => {
  // Test null/undefined values
  type NullableType = number | null | undefined
  type NestedNullable = NullableType | NestedNullable[]
  const question: NestedNullable[] = [1, [null], [undefined, [2]], 3]
  const answer: NullableType[] = [1, null, undefined, 2, 3]
  if (!isEqual(flatten(question), answer))
    throw Error('null/undefined values failed')
}
h.description = 'handles null and undefined values'

const i = (): void => {
  // Test with dates
  type DateOrNum = Date | number
  type NestedDate = DateOrNum | NestedDate[]
  const date = new Date()
  const question: NestedDate[] = [1, [date], [2]]
  const answer: DateOrNum[] = [1, date, 2]
  if (!isEqual(flatten(question), answer)) throw Error('date objects failed')
}
i.description = 'handles date objects'

const j = (): void => {
  // Test type preservation with interfaces
  type TestType = {
    id: number
    name: string
  }
  type NestedTest = TestType | NestedTest[]
  const item: TestType = { id: 1, name: 'test' }
  const question: NestedTest[] = [item, [{ id: 2, name: 'test2' }]]
  const result = flatten(question)

  // Check type preservation and structure
  if (!result.every((x) => typeof x === 'object' && 'id' in x && 'name' in x))
    throw Error('type preservation failed')

  const answer: TestType[] = [
    { id: 1, name: 'test' },
    { id: 2, name: 'test2' },
  ]
  if (!isEqual(result, answer)) throw Error('complex type flattening failed')
}
j.description = 'preserves typescript types'

const k = (): void => {
  // Test with recursive type for large nested array
  type RecursiveNum = number | RecursiveNum[]
  const makeNestedArray = (depth: number): RecursiveNum[] => {
    if (depth === 0) return [depth]
    return [depth, makeNestedArray(depth - 1)]
  }

  const question = makeNestedArray(5) // Reduced depth for practical testing
  const result = flatten(question)
  const expected = Array.from({ length: 6 }, (_, i) => 5 - i)
  if (!isEqual(result, expected)) throw Error('recursive array failed')
}
k.description = 'handles recursive arrays'

export { a, b, c, d, e, f, g, h, i, j, k }
