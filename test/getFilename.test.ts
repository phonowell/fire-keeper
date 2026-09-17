import { describe, expect, it } from 'vitest'

import getFilename from '../src/getFilename.js'

describe('getFilename', () => {
  it('应返回含扩展名的完整文件名', () => {
    expect(getFilename('path/to/file.txt')).toBe('file.txt')
    expect(getFilename('.gitignore')).toBe('.gitignore')
    expect(getFilename('dir/')).toBe('dir')
  })

  it('应处理反斜杠与多级扩展名', () => {
    expect(getFilename('a\\b\\c.txt')).toBe('c.txt')
    expect(getFilename('deep/dir/archive.tar.gz')).toBe('archive.tar.gz')
  })

  it('空输入应抛出异常', () => {
    expect(() => getFilename('')).toThrowError(/empty input/)
  })
})
