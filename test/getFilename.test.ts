import { describe, expect, it } from 'vitest'

import getFilename from '../src/getFilename.js'

describe('getFilename', () => {
  it('常规文件名', () => {
    expect(getFilename('path/to/file.txt')).toBe('file.txt')
    expect(getFilename('.gitignore')).toBe('.gitignore')
    expect(getFilename('path/to/dir/')).toBe('dir')
  })

  it('空字符串应抛异常', () => {
    expect(() => getFilename('')).toThrow()
  })
})
