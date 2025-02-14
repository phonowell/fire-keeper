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
    throw Error('0')
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
    throw Error('0')
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
    throw Error('0')
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
    throw Error('0')
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
    throw Error('0')
}
e.description = 'returns -1 for empty array'

export { a, b, c, d, e }
