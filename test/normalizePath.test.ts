import { describe, expect, it } from 'vitest'

import home from '../src/home.js'
import normalizePath from '../src/normalizePath.js'
import root from '../src/root.js'

describe('normalizePath', () => {
  it('应处理绝对路径', () => {
    const result = normalizePath('/tmp/demo')
    // 在 Windows 上会变成类似 'C:/tmp/demo'，在 Unix 系统上保持 '/tmp/demo'
    expect(result.endsWith('/tmp/demo')).toBe(true)
    expect(result.includes('tmp/demo')).toBe(true)
  })

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

  it('应处理 Windows 路径分隔符', () => {
    const result = normalizePath('folder\\sub\\file.txt')
    expect(result.endsWith('/folder/sub/file.txt')).toBe(true)
  })

  it('应移除路径末尾斜杠', () => {
    const result = normalizePath('./src/')
    const rootDir = root()
    expect(result).toBe(`${rootDir}/src`)
    expect(result.endsWith('/src')).toBe(true)
    expect(result.endsWith('/src/')).toBe(false)
  })

  it('应处理相对路径', () => {
    const result = normalizePath('folder/sub/file.txt')
    const rootDir = root()
    expect(result).toBe(`${rootDir}/folder/sub/file.txt`)
    expect(result.endsWith('/folder/sub/file.txt')).toBe(true)
  })

  it('应处理特殊字符路径', () => {
    const result = normalizePath('./src/文件@#￥%')
    const rootDir = root()
    expect(result).toBe(`${rootDir}/src/文件@#￥%`)
    expect(result.includes('文件@#￥%')).toBe(true)
  })

  it('应处理空字符串', () => {
    expect(normalizePath('')).toBe('')
  })

  it('应处理空白字符串', () => {
    expect(normalizePath('   ')).toBe('')
  })

  // 移除非字符串输入用例，normalizePath 仅保证字符串输入

  it('应处理根路径', () => {
    const result = normalizePath('/')
    expect(result).toBe('')
  })

  it('应处理多重分隔符', () => {
    const result = normalizePath('//')
    expect(result).toBe('')
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
