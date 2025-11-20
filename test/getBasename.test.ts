import { describe, expect, it } from 'vitest'

import getBasename from '../src/getBasename.js'

describe('getBasename', () => {
  it('常规文件名', () => {
    expect(getBasename('path/to/file.txt')).toBe('file')
    expect(getBasename('archive.tar.gz')).toBe('archive.tar')
    expect(getBasename('.gitignore')).toBe('.gitignore')
  })

  it('空字符串应抛出异常', () => {
    expect(() => getBasename('')).toThrow('getName/error: empty input')
  })
})
