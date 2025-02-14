import { isEqual } from 'radash'

import { $ } from './index'

const a = () => {
  const question = [1, 2, 3]
  const answer = 2
  if (!isEqual($.at(question, 1), answer)) throw new Error('0')
}
a.description = 'array[positive] -> value'

const b = () => {
  const question = [1, 2, 3]
  const answer = 3
  if (!isEqual($.at(question, -1), answer)) throw new Error('0')
}
b.description = 'array[negative] -> value'

const c = () => {
  const question = [1, 2, 3]
  const answer = undefined
  if (!isEqual($.at(question, 3), answer)) throw new Error('0')
}
c.description = 'array[out of bounds] -> undefined'

const d = () => {
  const question = { a: 1, b: 2, c: 3 }
  const answer = 2
  if (!isEqual($.at(question, 'b'), answer)) throw new Error('0')
}
d.description = 'object[existing key] -> value'

const e = () => {
  const question = { a: 1, b: 2, c: 3 }
  const answer = undefined
  if (!isEqual($.at(question, 'd'), answer)) throw new Error('0')
}
e.description = 'object[non-existent key] -> undefined'

export { a, b, c, d, e }
