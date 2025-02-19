import { strict as assert } from 'assert'

import { renderPath } from '../src/echo'
import { home, root, echo } from '../src'

const a = () => {
  // Test function existence
  let type = ''

  type = typeof renderPath
  if (type !== 'function') throw new Error('renderPath is not a function')

  type = typeof echo.whisper
  if (type !== 'function') throw new Error('whisper is not a function')

  type = typeof echo.freeze
  if (type !== 'function') throw new Error('freeze is not a function')

  type = typeof echo.pause
  if (type !== 'function') throw new Error('pause is not a function')

  type = typeof echo.resume
  if (type !== 'function') throw new Error('resume is not a function')
}
a.description = 'exposes required functions'

const b = () => {
  // Test basic echo functionality
  const msg = 'test message'
  assert.equal(echo(msg), msg, 'echo should return input message')
  assert.equal(
    echo('info', msg),
    msg,
    'echo with type should return input message',
  )
  assert.equal(echo(''), '', 'echo empty string should return empty string')
  const whitespaceMsg = ' \n '
  assert.equal(
    echo(whitespaceMsg),
    whitespaceMsg,
    'should preserve whitespace in returned message',
  )

  // Test message formatting
  const quotedMsg = "'quoted message'"
  echo(quotedMsg) // Tests renderContent with quotes
  const objMsg = { toString: () => 'test object' }
  echo(objMsg) // Tests String() conversion

  // Test when silent
  echo.isSilent = true
  assert.equal(echo(msg), msg, 'should return message when silent')
  echo.isSilent = false
}
b.description = 'handles basic echo operations'

const c = async () => {
  // Test freeze functionality
  const testFn = () => Promise.resolve('test result')
  const result1 = await echo.freeze(testFn)
  assert.equal(result1, 'test result', 'freeze should return function result')

  const promise = Promise.resolve('promise result')
  const result2 = await echo.freeze(promise)
  assert.equal(result2, 'promise result', 'freeze should handle promises')
}
c.description = 'handles freeze operations'

const d = async () => {
  // Test whisper functionality
  const testFn = () => Promise.resolve('whisper result')
  const result1 = await echo.whisper(testFn)
  assert.equal(
    result1,
    'whisper result',
    'whisper should return function result',
  )

  const promise = Promise.resolve('whisper promise')
  const result2 = await echo.whisper(promise)
  assert.equal(result2, 'whisper promise', 'whisper should handle promises')
}
d.description = 'handles whisper operations'

const e = () => {
  // Reset state first
  echo.isFrozen = false
  echo.isSilent = false

  // Test normal pause/resume functionality
  echo.pause()
  assert.equal(echo.isSilent, true, 'pause should set isSilent to true')
  echo.resume()
  assert.equal(echo.isSilent, false, 'resume should set isSilent to false')

  // Test when frozen
  echo.isFrozen = true
  echo.isSilent = false

  echo.pause()
  assert.equal(echo.isSilent, false, 'pause should not affect when frozen')
  echo.resume()
  assert.equal(echo.isSilent, false, 'resume should not affect when frozen')

  // Reset state
  echo.isFrozen = false
  echo.isSilent = false
}
e.description = 'handles pause/resume operations'

const f = async () => {
  // Test type rendering and caching
  const msg = 'test'
  echo('type1', msg) // First call caches type
  echo('type1', msg) // Second call uses cache
  echo('TYPE1', msg) // Case insensitive test
  echo('default', msg) // Default type test

  // Test type with varying lengths
  echo('', msg) // Empty type
  echo('verylongtype', msg) // Type longer than 10 chars

  // Test time rendering and caching
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  echo(msg) // First call caches time
  echo(msg) // Use cached time
  await wait(1100) // Wait more than 1 second
  echo(msg) // Should generate new time
}
f.description = 'handles type rendering and caching'

const g = () => {
  const homeString = home()
  const rootString = root()

  const tests = [
    [`${homeString}/test.txt`, '~/test.txt'],
    [`${rootString}/src/test.txt`, './src/test.txt'],
    [homeString, '~'],
    [rootString, '.'],
    ['', ''],
  ]

  for (const [input, expected] of tests) {
    const result = renderPath(input)
    if (result !== expected)
      throw new Error(
        `path rendering failed for ${input}, expected ${expected} but got ${result}`,
      )
  }
}
g.description = 'renders paths correctly'

export { a, b, c, d, e, f, g }
