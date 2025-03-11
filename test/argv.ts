import { isEqual } from 'radash'

import { argv } from '../src'

// Store original argv
const originalArgv = [...process.argv]

// Helper to set process.argv
const setArgv = (args: string[]) => {
  process.argv = ['node', 'script.js', ...args]
}

// Helper to restore original argv
const restoreArgv = () => {
  process.argv = originalArgv
}

const a = async () => {
  setArgv([])
  const args = await argv()
  if (!isEqual(args._, [])) throw new Error('empty args handling failed')
  restoreArgv()
}
a.description = 'handles empty arguments'

const b = async () => {
  setArgv(['--name', 'test'])
  const args = await argv()
  if (args.name !== 'test') throw new Error('named argument parsing failed')
  restoreArgv()
}
b.description = 'parses named arguments'

const c = async () => {
  setArgv(['pos1', 'pos2'])
  const args = await argv()
  if (!isEqual(args._, ['pos1', 'pos2']))
    throw new Error('positional args parsing failed')
  restoreArgv()
}
c.description = 'handles positional arguments'

const d = async () => {
  setArgv(['--flag'])
  const args = await argv()
  if (args.flag !== true) throw new Error('boolean flag parsing failed')
  restoreArgv()
}
d.description = 'handles boolean flags'

const e = async () => {
  setArgv(['--numbers=1', '--numbers=2', '--numbers=3'])
  const args = await argv()
  if (!isEqual(args.numbers, [1, 2, 3]))
    throw new Error('array argument parsing failed')
  restoreArgv()
}
e.description = 'handles array arguments'

const f = async () => {
  setArgv(['--key=value'])
  const args = await argv()
  if (args.key !== 'value') throw new Error('key-value parsing failed')
  restoreArgv()
}
f.description = 'parses key-value pairs'

const g = async () => {
  setArgv(['--special', '@#$%'])
  const args = await argv()
  if (args.special !== '@#$%') throw new Error('special characters failed')
  restoreArgv()
}
g.description = 'handles special characters'

const h = async () => {
  setArgv(['--num', '123'])
  const args = await argv()
  if (args.num !== 123) throw new Error('number string parsing failed')
  restoreArgv()
}
h.description = 'preserves number strings'

const i = async () => {
  setArgv(['pos1', '--flag1', '--key=value', 'pos2'])
  const args = await argv()
  if (
    !isEqual(args._, ['pos1', 'pos2']) ||
    args.flag1 !== true ||
    args.key !== 'value'
  )
    throw new Error('mixed arguments parsing failed')

  restoreArgv()
}
i.description = 'handles mixed arguments'

const j = async () => {
  setArgv([])
  const args = await argv()
  if (typeof args.$0 !== 'string') throw new Error('$0 property missing')
  restoreArgv()
}
j.description = 'includes $0 property'

export { a, b, c, d, e, f, g, h, i, j }
