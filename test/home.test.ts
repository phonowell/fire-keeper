import os from 'os'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import home from '../src/home.js'

describe('home', () => {
  let originalHomedir: () => string

  beforeEach(() => {
    originalHomedir = os.homedir
  })

  afterEach(() => {
    // 恢复原方法
    Object.defineProperty(os, 'homedir', {
      value: originalHomedir,
      writable: true,
    })
  })

  it('应返回当前用户主目录的绝对路径', () => {
    const expected = os.homedir().replace(/\\/g, '/')
    expect(home()).toBe(expected)
  })

  it('返回值应为字符串类型', () => {
    expect(typeof home()).toBe('string')
  })

  it('路径应使用正斜杠分隔', () => {
    const result = home()
    expect(result.includes('\\')).toBe(false)
    // 支持 Windows 路径首字母为盘符
    expect(result.startsWith('/') || /^[A-Z]:\//.test(result)).toBe(true)
  })

  it('兼容 Windows 路径斜杠（模拟）', () => {
    const winPath = 'C:\\Users\\test'
    Object.defineProperty(os, 'homedir', {
      value: () => winPath,
      writable: true,
    })
    expect(home()).toBe('C:/Users/test')
  })

  it('os.homedir 返回仅盘符路径时应正常返回', () => {
    Object.defineProperty(os, 'homedir', {
      value: () => 'C:/',
      writable: true,
    })
    expect(home()).toBe('C:/')
  })

  it('os.homedir 抛异常时应抛出异常', () => {
    Object.defineProperty(os, 'homedir', {
      value: () => {
        throw new Error('fail')
      },
      writable: true,
    })
    expect(() => home()).toThrow('fail')
  })

  it('os.homedir 返回异常值时应处理', () => {
    // 测试 undefined 情况
    Object.defineProperty(os, 'homedir', {
      value: () => undefined as unknown as string,
      writable: true,
    })
    expect(() => home()).toThrow()

    // 测试 null 情况
    Object.defineProperty(os, 'homedir', {
      value: () => null as unknown as string,
      writable: true,
    })
    expect(() => home()).toThrow()
  })
})
