import { describe, expect, it } from 'vitest'

import getName from '../src/getName.js'

describe('getName', () => {
  it('应正确解析常规文件路径', () => {
    expect(getName('path/to/file.txt')).toEqual({
      basename: 'file',
      dirname: 'path/to',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应抛出空输入异常', () => {
    expect(() => getName('')).toThrowError(/empty input/)
  })

  it('应正确解析多级扩展名文件', () => {
    expect(getName('archive.tar.gz')).toEqual({
      basename: 'archive.tar',
      dirname: '.',
      extname: '.gz',
      filename: 'archive.tar.gz',
    })
  })
})
