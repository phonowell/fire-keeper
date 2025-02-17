import path from 'path'

import { $ } from './index'

const basicPathTests = () => {
  const tests = [
    // 基本路径测试
    ['./source', `${$.root()}/source`],
    ['~/opt', `${$.home()}/opt`],
    ['', ''],

    // 父目录测试 (修改后)
    ['./a/b/../c', `${$.root()}/a/c`],
    ['../a', path.resolve(path.dirname($.root()), 'a').replace(/\\/g, '/')],

    // 特殊字符测试
    ['./path with spaces', `${$.root()}/path with spaces`],
    ['./special!@#$', `${$.root()}/special!@#$`],

    // Unicode路径测试
    ['./测试/路径', `${$.root()}/测试/路径`],
    ['~/文件/夹', `${$.home()}/文件/夹`],

    // 忽略模式测试 (修改后)
    ['!./ignore', `!${$.root()}/ignore`],
    [
      '!../ignore',
      `!${path.resolve(path.dirname($.root()), 'ignore').replace(/\\/g, '/')}`,
    ],

    // 路径分隔符测试
    ['a\\b/c\\d', `${$.root()}/a/b/c/d`],
    ['/absolute/path', '/absolute/path'],

    // 重复斜杠测试
    ['path//to///dir', `${$.root()}/path/to/dir`],
    ['./multiple//slashes', `${$.root()}/multiple/slashes`],

    // 点号边界情况 (修改后)
    ['.', $.root()],
    ['..', path.resolve(path.dirname($.root())).replace(/\\/g, '/')],
    ['...', `${$.root()}/...`],
  ]

  for (const [input, expected] of tests) {
    const result = $.normalizePath(input)
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
    if ($.normalizePath(input as unknown as string) !== '') {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      throw new Error(`Invalid input not handled correctly: ${String(input)}`)
    }
  }
}
invalidInputTests.description = 'handles invalid inputs correctly'

export { basicPathTests, invalidInputTests }
