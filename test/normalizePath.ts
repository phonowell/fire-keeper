import path from 'path'

import { home, normalizePath, root } from '../src/index.js'

const basicPathTests = () => {
  const tests = [
    ['./source', `${root()}/source`],
    ['~/opt', `${home()}/opt`],
    ['', ''],

    ['./a/b/../c', `${root()}/a/c`],
    ['../a', path.resolve(path.dirname(root()), 'a').replace(/\\/g, '/')],

    ['./path with spaces', `${root()}/path with spaces`],
    ['./special!@#$', `${root()}/special!@#$`],

    ['./测试/路径', `${root()}/测试/路径`],
    ['~/文件/夹', `${home()}/文件/夹`],

    ['!./ignore', `!${root()}/ignore`],
    [
      '!../ignore',
      `!${path.resolve(path.dirname(root()), 'ignore').replace(/\\/g, '/')}`,
    ],

    ['a\\b/c\\d', `${root()}/a/b/c/d`],
    ['/absolute/path', '/absolute/path'],

    ['path//to///dir', `${root()}/path/to/dir`],
    ['./multiple//slashes', `${root()}/multiple/slashes`],

    ['.', root()],
    ['..', path.resolve(path.dirname(root())).replace(/\\/g, '/')],
    ['...', `${root()}/...`],
  ]

  for (const [input, expected] of tests) {
    const result = normalizePath(input)
    if (result !== expected) {
      throw new Error(`Path normalization failed for ${input}
        Expected: ${expected}
        Got: ${result}`)
    }
  }
}
basicPathTests.description = 'handles all path normalization cases'

const invalidInputTests = () => {
  const invalidInputs = [undefined, null, {}, [], NaN, true, 123]

  for (const input of invalidInputs) {
    if (normalizePath(input as unknown as string) !== '')
      throw new Error(`Invalid input not handled correctly: ${String(input)}`)
  }
}
invalidInputTests.description = 'handles invalid inputs correctly'

export { basicPathTests, invalidInputTests }
