import { describe, expect, it } from 'vitest'

import getDirname from '../src/getDirname.js'

describe('getDirname', () => {
  it('应返回目录部分', () => {
    expect(getDirname('path/to/file.txt')).toBe('path/to')
    expect(getDirname('file.txt')).toBe('.')
    expect(getDirname('/abs/dir/file')).toBe('/abs/dir')
  })

  it('应处理反斜杠与尾部斜杠', () => {
    expect(getDirname('a\\b\\c.txt')).toBe('a/b')
    expect(getDirname('a/b/c/')).toBe('a/b')
  })

  it('UNC 路径应保留尾部斜杠', () => {
    expect(getDirname('//server/share/file.txt')).toBe('//server/share/')
  })

  it('空输入应抛出异常', () => {
    expect(() => getDirname('')).toThrowError(/empty input/)
  })
})
