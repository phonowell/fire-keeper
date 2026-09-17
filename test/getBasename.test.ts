import { describe, expect, it } from 'vitest'

import getBasename from '../src/getBasename.js'

describe('getBasename', () => {
  it('应返回不含扩展名的文件名', () => {
    expect(getBasename('path/to/file.txt')).toBe('file')
    expect(getBasename('archive.tar.gz')).toBe('archive.tar')
    expect(getBasename('.gitignore')).toBe('.gitignore')
    expect(getBasename('no-ext')).toBe('no-ext')
  })

  it('应处理反斜杠路径与尾部斜杠', () => {
    expect(getBasename('dir\\sub\\file.txt')).toBe('file')
    expect(getBasename('dir/sub/')).toBe('sub')
  })

  it('空输入应抛出异常', () => {
    expect(() => getBasename('')).toThrowError(/empty input/)
  })
})
