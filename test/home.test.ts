import os from 'os'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import home from '../src/home.js'

describe('home', () => {
  let originalHomedir: () => string

  beforeEach(() => {
    originalHomedir = os.homedir
  })

  afterEach(() => {
    Object.defineProperty(os, 'homedir', {
      value: originalHomedir,
      writable: true,
    })
  })

  it('应返回当前用户主目录的绝对路径，且为字符串，且路径分隔符为正斜杠', () => {
    const expected = os.homedir().replace(/\\/g, '/')
    const result = home()
    expect(typeof result).toBe('string')
    expect(result).toBe(expected)
    expect(result.includes('\\')).toBe(false)
    expect(result.startsWith('/') || /^[A-Z]:\//.test(result)).toBe(true)
  })

  it('兼容 Windows 路径斜杠及盘符路径', () => {
    Object.defineProperty(os, 'homedir', {
      value: () => 'C:\\Users\\test',
      writable: true,
    })
    expect(home()).toBe('C:/Users/test')

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
})
