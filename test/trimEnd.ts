import { isEqual } from 'radash'

import { trimEnd } from '../src/index.js'

const a = (): void => {
  const question = '  hello  '
  const answer = '  hello'
  if (!isEqual(trimEnd(question), answer))
    throw Error('basic whitespace trim failed')
}
a.description = 'removes trailing whitespace when no chars provided'

const b = (): void => {
  const question = 'hello\n\t\r\f\v'
  const answer = 'hello'
  if (!isEqual(trimEnd(question), answer))
    throw Error('special whitespace trim failed')
}
b.description = 'removes all types of whitespace from end'

const c = (): void => {
  const question = 'hello....'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '.'), answer))
    throw Error('basic char trim failed')
}
c.description = 'removes specified basic char from end'

const d = (): void => {
  const question = 'hello\n\n'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '\n'), answer))
    throw Error('newline trim failed')
}
d.description = 'removes special char (newline) from end'

const e = (): void => {
  const question = 'hello\t\t'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '\t'), answer)) throw Error('tab trim failed')
}
e.description = 'removes special char (tab) from end'

const f = (): void => {
  const question = 'hello***'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '*'), answer))
    throw Error('regex special char trim failed')
}
f.description = 'removes regex special char from end'

const g = (): void => {
  const question = 'hello123123'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '123'), answer))
    throw Error('multiple chars pattern failed')
}
g.description = 'removes multiple chars pattern from end'

const h = (): void => {
  const question = 'hello...**'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '.*'), answer))
    throw Error('mixed chars pattern failed')
}
h.description = 'removes mixed chars pattern from end'

const i = (): void => {
  const question = 'hello'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '.'), answer))
    throw Error('no matching chars failed')
}
i.description = 'returns original string when no matching chars at end'

const j = (): void => {
  if (trimEnd('') !== '') throw Error('empty string failed')
  if (trimEnd('', '*') !== '') throw Error('empty string with pattern failed')
}
j.description = 'handles empty string'

const k = (): void => {
  const question = 'hello世界世界'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '世界'), answer))
    throw Error('unicode trim failed')
}
k.description = 'handles unicode characters'

const l = (): void => {
  const question = 'hello[]^$'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '[]^$'), answer))
    throw Error('regexp metacharacters failed')
}
l.description = 'handles regexp metacharacters'

const m = (): void => {
  const question = 'hello  .**\t\n'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '.*\t\n '), answer))
    throw Error('mixed whitespace and chars failed')
}
m.description = 'handles mixed whitespace and custom chars'

const n = (): void => {
  const longString = 'a'.repeat(1000) + '*'.repeat(1000)
  const answer = 'a'.repeat(1000)
  if (!isEqual(trimEnd(longString, '*'), answer))
    throw Error('long string failed')
}
n.description = 'handles very long strings'

const o = (): void => {
  const result = trimEnd(trimEnd(trimEnd('hello...***\t\n', '\t\n'), '*'), '.')
  if (result !== 'hello') throw Error('multiple calls failed')
}
o.description = 'supports multiple calls'

const p = (): void => {
  const question = 'hello\n\t\r\f\v'
  const answer = 'hello'
  if (!isEqual(trimEnd(question, '\n\t\r\f\v'), answer))
    throw Error('consecutive special chars failed')
}
p.description = 'handles consecutive special chars'

const q = (): void => {
  const specialChars = Object.entries({
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\f': '\\f',
    '\v': '\\v',
  })

  for (const [char] of specialChars) {
    const question = `hello${char}${char}`
    const answer = 'hello'
    if (!isEqual(trimEnd(question, char), answer))
      throw Error(`special char ${char} failed`)
  }
}
q.description = 'handles all special chars'

export { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q }
