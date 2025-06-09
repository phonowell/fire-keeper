import { isEqual } from 'radash'

import { run } from '../src/index.js'

const a = () => {
  const result = run(() => 'test')
  if (result !== 'test') throw new Error('basic function execution failed')
}
a.description = 'executes basic function'

const b = () => {
  let executed = false as boolean
  run(() => {
    executed = true
  })
  if (!executed) throw new Error('function side effect failed')
}
b.description = 'handles function side effects'

const c = () => {
  const result = run(() => 42)
  if (result !== 42) throw new Error('number return value failed')
}
c.description = 'handles number return value'

const d = () => {
  const obj = { test: true }
  const result = run(() => obj)
  if (!isEqual(result, obj)) throw new Error('object return value failed')
}
d.description = 'handles object return value'

const e = () => {
  type TestType = {
    id: number
    name: string
  }
  const data: TestType = { id: 1, name: 'test' }
  const result = run<TestType>(() => data)
  if (result.id !== 1 || result.name !== 'test')
    throw new Error('type preservation failed')
}
e.description = 'preserves return type'

const f = () => {
  const regularFunction = () => 'regular'
  const result = run(regularFunction)
  if (result !== 'regular') throw new Error('regular function handling failed')
}
f.description = 'handles regular functions'

const g = () => {
  const arr = [1, 2, 3]
  const result = run(() => arr)
  if (!isEqual(result, [1, 2, 3])) throw new Error('array return value failed')
}
g.description = 'handles array return value'

const h = () => {
  try {
    run(() => {
      throw new Error('test error')
    })
    throw new Error('error propagation failed')
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'test error')
      throw new Error('error handling failed')
  }
}
h.description = 'handles thrown errors'

export { a, b, c, d, e, f, g, h }
