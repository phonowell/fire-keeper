import { describe, expect, it } from 'vitest'

import home from '../src/home.js'
import normalizePath from '../src/normalizePath.js'
import root from '../src/root.js'

describe('normalizePath', () => {
  it('应处理 ~ 开头路径', () => {
    const result = normalizePath('~/docs')
    const homeDir = home()
    expect(result).toBe(`${homeDir}/docs`)
    expect(result.endsWith('/docs')).toBe(true)
  })

  it('应处理 . 开头路径', () => {
    const result = normalizePath('./src')
    const rootDir = root()
    expect(result).toBe(`${rootDir}/src`)
    expect(result.endsWith('/src')).toBe(true)
  })

  it('应处理 .. 开头路径', () => {
    const result = normalizePath('../data')
    // ../data 会解析到上一级目录，所以不会以当前目录开头
    expect(result.includes('data')).toBe(true)
    expect(result.endsWith('/data')).toBe(true)
  })

  it('应处理嵌套多层 ..', () => {
    const result = normalizePath('../../foo/bar')
    // ../../foo/bar 会解析到上两级目录，所以不会以当前目录开头
    expect(result.includes('foo/bar')).toBe(true)
    expect(result.endsWith('/foo/bar')).toBe(true)
  })

  it('应处理 ! 前缀路径', () => {
    const result = normalizePath('!./ignore')
    const rootDir = root()
    expect(result.startsWith('!')).toBe(true)
    expect(result).toBe(`!${rootDir}/ignore`)
    expect(result.endsWith('/ignore')).toBe(true)
  })

  it('应处理混合 ! 和 ~ 前缀', () => {
    const result = normalizePath('!~/docs')
    const homeDir = home()
    expect(result.startsWith('!')).toBe(true)
    expect(result).toBe(`!${homeDir}/docs`)
    expect(result.includes('/docs')).toBe(true)
  })

  it('应处理空字符串', () => {
    expect(normalizePath('')).toBe('')
  })

  it('应处理空白字符串', () => {
    expect(normalizePath('   ')).toBe('')
  })

  it('应处理复杂忽略路径', () => {
    const result = normalizePath('!/')
    expect(result).toBe('!')
  })

  it('应处理仅 ! 前缀', () => {
    const result = normalizePath('!')
    expect(result.startsWith('!')).toBe(true)
  })
})
