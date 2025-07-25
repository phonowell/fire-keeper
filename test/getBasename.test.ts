import { describe, expect, it } from 'vitest'

import getBasename from '../src/getBasename.js'

describe('getBasename', () => {
  it('应返回常规文件名（无扩展名）', () => {
    expect(getBasename('path/to/file.txt')).toBe('file')
    expect(getBasename('a/b/c/script.js')).toBe('script')
    expect(getBasename('demo.md')).toBe('demo')
  })

  it('应处理多重扩展名', () => {
    expect(getBasename('archive.tar.gz')).toBe('archive.tar')
    expect(getBasename('script.test.ts')).toBe('script.test')
  })

  it('应处理无扩展名文件', () => {
    expect(getBasename('README')).toBe('README')
    expect(getBasename('folder/.env')).toBe('.env')
  })

  it('应处理特殊文件名', () => {
    expect(getBasename('.gitignore')).toBe('.gitignore')
    expect(getBasename('.npmrc')).toBe('.npmrc')
  })

  it('应处理带路径的特殊文件', () => {
    expect(getBasename('config/.gitignore')).toBe('.gitignore')
    expect(getBasename('.config/.env')).toBe('.env')
  })

  it('应处理路径分隔符结尾', () => {
    expect(getBasename('dir/')).toBe('dir')
    expect(getBasename('a/b/c/')).toBe('c')
  })

  it('应处理仅扩展名文件', () => {
    expect(getBasename('.txt')).toBe('.txt')
    expect(getBasename('.env')).toBe('.env')
  })

  it('应处理 Windows 路径', () => {
    expect(getBasename('a\\b\\c.txt')).toBe('c')
    expect(getBasename('a\\b\\.env')).toBe('.env')
  })

  it('应处理特殊字符文件名', () => {
    expect(getBasename('a/b/c@#$.js')).toBe('c@#$')
    expect(getBasename('a/b/测试.js')).toBe('测试')
  })

  it('应处理极端长路径', () => {
    const longName = `${'a'.repeat(255)}.txt`
    expect(getBasename(longName)).toBe('a'.repeat(255))
  })

  it('应处理根路径和仅分隔符', () => {
    expect(getBasename('/')).toBe('')
    expect(getBasename('\\\\')).toBe('')
    expect(getBasename('////')).toBe('')
  })

  it('应处理当前目录和上级目录', () => {
    expect(getBasename('.')).toBe('.')
    expect(getBasename('..')).toBe('..')
  })

  it('应处理隐藏目录路径', () => {
    expect(getBasename('.config/.hidden')).toBe('.hidden')
  })

  it('应处理路径包含多余点', () => {
    expect(getBasename('a/b..c.txt')).toBe('b..c')
    expect(getBasename('a/.b..c')).toBe('.b.')
  })

  it('应处理空字符串', () => {
    expect(() => getBasename('')).toThrow('empty input')
  })

  it('应处理混合分隔符路径', () => {
    expect(getBasename('a/b\\c.txt')).toBe('c')
  })

  it('应处理文件名包含空格', () => {
    expect(getBasename('a/ b.txt')).toBe(' b')
    expect(getBasename('a/空 格.txt')).toBe('空 格')
  })

  it('应处理文件名包含特殊 Unicode 字符', () => {
    expect(getBasename('a/𝌆.txt')).toBe('𝌆')
    expect(getBasename('路径/😀.js')).toBe('😀')
  })
})
