import { isEqual } from 'radash'

import { $ } from './index'

const a = (): void => {
  const question = [1, 2, 3]
  const answer = [1, 2, 3]
  if (!isEqual($.flatten(question), answer)) throw Error('0')
}
a.description = 'returns original array when no nesting'

const b = (): void => {
  const question: (number | number[])[] = [1, [2, 3], 4]
  const answer = [1, 2, 3, 4]
  if (!isEqual($.flatten(question), answer)) throw Error('0')
}
b.description = 'flattens single level array'

const c = (): void => {
  const question: (number | number[])[] = [1, [2], [3, 4], 5]
  const answer = [1, 2, 3, 4, 5]
  if (!isEqual($.flatten(question), answer)) throw Error('0')
}
c.description = 'flattens multiple nested arrays'

const d = (): void => {
  const question: number[] = []
  const answer: number[] = []
  if (!isEqual($.flatten(question), answer)) throw Error('0')
}
d.description = 'handles empty array'

const e = (): void => {
  const question: (number | number[])[] = [1, [], [2], [], [3], 4]
  const answer = [1, 2, 3, 4]
  if (!isEqual($.flatten(question), answer)) throw Error('0')
}
e.description = 'handles empty nested arrays'

export { a, b, c, d, e }
