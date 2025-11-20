import { describe, expect, it } from 'vitest'

import getExtname from '../src/getExtname.js'

describe('getExtname', () => {
  it('常规扩展名', () => {
    expect(getExtname('file.txt')).toBe('.txt')
    expect(getExtname('archive.tar.gz')).toBe('.gz')
    expect(getExtname('.gitignore')).toBe('')
  })

  it('空字符串抛异常', () => {
    expect(() => getExtname('')).toThrow()
  })
})
