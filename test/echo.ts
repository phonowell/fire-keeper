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

const g = () => {
  const homeString = home()
  const rootString = root()

  const tests = [
    [`${homeString}/test.txt`, '~/test.txt'],
    [`${rootString}/src/test.txt`, './src/test.txt'],
    // 增加边界情况
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

export { a, g }
