import nodeOs from 'os'
import path from 'path'

import { home, os as osType } from '../src/index.js'

const a = () => {
  if (typeof home !== 'function') throw new Error('home is not a function')
}
a.description = 'is a function'

const b = () => {
  const homePath = home()

  if (typeof homePath !== 'string') throw new Error('home path is not a string')
  if (!homePath) throw new Error('home path is empty')
}
b.description = 'returns non-empty string'

const c = () => {
  const homePath = home()

  if (homePath.includes('\\'))
    throw new Error('contains Windows-style separators')

  if (!path.isAbsolute(homePath)) throw new Error('path is not absolute')
}
c.description = 'normalizes separators'

const d = () => {
  const firstCall = home()
  const secondCall = home()

  if (firstCall !== secondCall) throw new Error('inconsistent home path')
}
d.description = 'returns consistent path'

const e = () => {
  const homePath = home()

  if (homePath.endsWith('/')) throw new Error('path ends with slash')
}
e.description = 'no trailing slash'

const f = () => {
  const homePath = home()
  const expected = nodeOs.homedir().replace(/\\/g, '/')

  if (homePath !== expected) throw new Error('does not match os.homedir()')
}
f.description = 'matches os.homedir'

const g = () => {
  const homePath = home()
  const parts = homePath.split('/')

  if (parts.length < 2) throw new Error('invalid path structure')

  if (osType() === 'windows') {
    if (!/^[A-Za-z]:$/.test(parts[0]))
      throw new Error('Windows path not starting with drive letter')
  } else if (parts[0] !== '') throw new Error('path not starting from root')

  if (parts.slice(1).some((part) => !part))
    throw new Error('path contains empty segments')
}
g.description = 'has valid structure'

const h = () => {
  const homePath = home().toLowerCase()

  if (osType() === 'windows') {
    if (!homePath.includes('users'))
      throw new Error('invalid Windows home path structure')
  } else {
    if (!homePath.includes('/home/') && !homePath.includes('/users/'))
      throw new Error('invalid Unix-like home path structure')
  }
}
h.description = 'follows platform conventions'

export { a, b, c, d, e, f, g, h }
