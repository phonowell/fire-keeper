import { describe, expect, it } from 'vitest'

import getExtname from '../src/getExtname.js'

describe('getExtname', () => {
  it('应返回含点的扩展名或空字符串', () => {
    expect(getExtname('file.txt')).toBe('.txt')
    expect(getExtname('archive.tar.gz')).toBe('.gz')
    expect(getExtname('no-ext')).toBe('')
    expect(getExtname('.gitignore')).toBe('')
  })

  it('应处理复合隐藏文件与结尾点号', () => {
    expect(getExtname('.eslintrc.json')).toBe('.json')
    expect(getExtname('file.')).toBe('.')
    expect(getExtname('dir/sub/')).toBe('')
  })

  it('空输入应抛出异常', () => {
    expect(() => getExtname('')).toThrowError(/empty input/)
  })
})
