import { isEqual } from 'radash'

import { $ } from './index'

const a = (): void => {
  const question = '  hello  '
  const answer = '  hello'
  if (!isEqual($.trimEnd(question), answer)) throw Error('0')
}
a.description = 'removes trailing whitespace when no chars provided'

const b = (): void => {
  const question = 'hello\n\t\r\f\v'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question), answer)) throw Error('0')
}
b.description = 'removes all types of whitespace from end'

const c = (): void => {
  const question = 'hello....'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '.'), answer)) throw Error('0')
}
c.description = 'removes specified basic char from end'

const d = (): void => {
  const question = 'hello\n\n'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '\n'), answer)) throw Error('0')
}
d.description = 'removes special char (newline) from end'

const e = (): void => {
  const question = 'hello\t\t'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '\t'), answer)) throw Error('0')
}
e.description = 'removes special char (tab) from end'

const f = (): void => {
  const question = 'hello***'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '*'), answer)) throw Error('0')
}
f.description = 'removes regex special char from end'

const g = (): void => {
  const question = 'hello123123'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '123'), answer)) throw Error('0')
}
g.description = 'removes multiple chars pattern from end'

const h = (): void => {
  const question = 'hello...**'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '.*'), answer)) throw Error('0')
}
h.description = 'removes mixed chars pattern from end'

const i = (): void => {
  const question = 'hello'
  const answer = 'hello'
  if (!isEqual($.trimEnd(question, '.'), answer)) throw Error('0')
}
i.description = 'returns original string when no matching chars at end'

export { a, b, c, d, e, f, g, h, i }
