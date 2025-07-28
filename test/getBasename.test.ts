import { describe, expect, it } from 'vitest'

import getBasename from '../src/getBasename.js'

describe('getBasename', () => {
  it('常规与多扩展名', () => {
    expect(getBasename('path/to/file.txt')).toBe('file')
    expect(getBasename('a/b/c/script.js')).toBe('script')
    expect(getBasename('demo.md')).toBe('demo')
    expect(getBasename('archive.tar.gz')).toBe('archive.tar')
    expect(getBasename('script.test.ts')).toBe('script.test')
  })

  it('无扩展名与特殊文件', () => {
    expect(getBasename('README')).toBe('README')
    expect(getBasename('folder/.env')).toBe('.env')
    expect(getBasename('.gitignore')).toBe('.gitignore')
    expect(getBasename('.npmrc')).toBe('.npmrc')
    expect(getBasename('.txt')).toBe('.txt')
  })

  it('带路径的特殊文件', () => {
    expect(getBasename('config/.gitignore')).toBe('.gitignore')
    expect(getBasename('.config/.env')).toBe('.env')
    expect(getBasename('.config/.hidden')).toBe('.hidden')
  })

  it('路径分隔符结尾与多余斜杠', () => {
    expect(getBasename('dir/')).toBe('dir')
    expect(getBasename('a/b/c/')).toBe('c')
    expect(getBasename('a//b.txt')).toBe('b')
    expect(getBasename('a///b.js')).toBe('b')
  })

  it('Windows 路径与混合分隔符', () => {
    expect(getBasename('a\\b\\c.txt')).toBe('c')
    expect(getBasename('a\\b\\.env')).toBe('.env')
    expect(getBasename('a/b\\c.txt')).toBe('c')
  })

  it('特殊字符、空格、Unicode', () => {
    expect(getBasename('a/b/c@#$.js')).toBe('c@#$')
    expect(getBasename('a/b/测试.js')).toBe('测试')
    expect(getBasename('a/ b.txt')).toBe(' b')
    expect(getBasename('a/空 格.txt')).toBe('空 格')
    expect(getBasename('a/𝌆.txt')).toBe('𝌆')
    expect(getBasename('路径/😀.js')).toBe('😀')
  })

  it('极端长路径', () => {
    const longName = `${'a'.repeat(255)}.txt`
    expect(getBasename(longName)).toBe('a'.repeat(255))
  })

  it('根路径、仅分隔符、当前/上级目录', () => {
    expect(getBasename('/')).toBe('')
    expect(getBasename('\\\\')).toBe('')
    expect(getBasename('////')).toBe('')
    expect(getBasename('.')).toBe('.')
    expect(getBasename('..')).toBe('..')
  })

  it('路径包含多余点', () => {
    expect(getBasename('a/b..c.txt')).toBe('b..c')
    expect(getBasename('a/.b..c')).toBe('.b.')
  })

  it('空字符串应抛出异常', () => {
    expect(() => getBasename('')).toThrow('getName/error: empty input')
  })
})
