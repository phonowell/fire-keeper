import { isEqual } from 'radash'

import { $ } from './index'

const a = () => {
  const question = 'test/a'
  const answer = ['test/a']
  if (!isEqual($.toArray(question), answer)) throw new Error('0')
}
a.description = 'string -> string[]'

const b = () => {
  const question = ['test/b']
  const answer = ['test/b']
  if (!isEqual($.toArray(question), answer)) throw new Error('0')
}
b.description = 'string[] -> string[]'

export { a, b }
