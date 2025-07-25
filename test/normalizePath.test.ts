import { describe, expect, it } from 'vitest'

import normalizePath from '../src/normalizePath.js'

describe('normalizePath', () => {
  it('应处理绝对路径', () => {
    const result = normalizePath('/tmp/demo')
    expect(result).toBe('/tmp/demo')
  })

  it('应处理 ~ 开头路径', () => {
    const result = normalizePath('~/docs')
    expect(result.endsWith('/docs')).toBe(true)
    expect(result.startsWith('/')).toBe(true)
  })

  it('应处理 . 开头路径', () => {
    const result = normalizePath('./src')
    expect(result.endsWith('/src')).toBe(true)
    expect(result.startsWith('/')).toBe(true)
  })

  it('应处理 .. 开头路径', () => {
    const result = normalizePath('../data')
    expect(result.includes('data')).toBe(true)
    expect(result.startsWith('/')).toBe(true)
  })

  it('应处理嵌套多层 ..', () => {
    const result = normalizePath('../../foo/bar')
    expect(result.includes('foo/bar')).toBe(true)
    expect(result.startsWith('/')).toBe(true)
  })

  it('应处理 ! 前缀路径', () => {
    const result = normalizePath('!./ignore')
    expect(result.startsWith('!')).toBe(true)
    expect(result.endsWith('/ignore')).toBe(true)
  })

  it('应处理混合 ! 和 ~ 前缀', () => {
    const result = normalizePath('!~/docs')
    expect(result.startsWith('!')).toBe(true)
    expect(result.includes('/docs')).toBe(true)
  })

  it('应处理 Windows 路径分隔符', () => {
    const result = normalizePath('folder\\sub\\file.txt')
    expect(result.endsWith('/folder/sub/file.txt')).toBe(true)
  })

  it('应移除路径末尾斜杠', () => {
    const result = normalizePath('./src/')
    expect(result.endsWith('/src')).toBe(true)
    expect(result.endsWith('/src/')).toBe(false)
  })

  it('应处理相对路径', () => {
    const result = normalizePath('folder/sub/file.txt')
    expect(result.endsWith('/folder/sub/file.txt')).toBe(true)
    expect(result.startsWith('/')).toBe(true)
  })

  it('应处理特殊字符路径', () => {
    const result = normalizePath('./src/文件@#￥%')
    expect(result.includes('文件@#￥%')).toBe(true)
  })

  it('应处理空字符串', () => {
    expect(normalizePath('')).toBe('')
  })

  it('应处理空白字符串', () => {
    expect(normalizePath('   ')).toBe('')
  })

  it('应处理非字符串输入', () => {
    expect(normalizePath(null as any)).toBe('')
    expect(normalizePath(undefined as any)).toBe('')
    expect(normalizePath(123 as any)).toBe('')
  })

  it('应处理根路径', () => {
    const result = normalizePath('/')
    expect(result).toBe('')
  })

  it('应处理多重分隔符', () => {
    const result = normalizePath('//')
    expect(result).toBe('')
  })

  it('应处理仅 ! 前缀', () => {
    const result = normalizePath('!')
    expect(result.startsWith('!')).toBe(true)
  })

  it('应处理复杂忽略路径', () => {
    const result = normalizePath('!/')
    expect(result).toBe('!')
  })
})
