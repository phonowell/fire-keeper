import { describe, expect, it } from 'vitest'

import getDirname from '../src/getDirname.js'

describe('getDirname', () => {
  it('常规路径与当前目录', () => {
    expect(getDirname('path/to/file.txt')).toBe('path/to')
    expect(getDirname('demo.md')).toBe('.')
    expect(getDirname('a/b/c/')).toBe('a/b')
  })

  it('空字符串应抛异常', () => {
    expect(() => getDirname('')).toThrow()
  })
})
