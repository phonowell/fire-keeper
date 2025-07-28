import { afterEach, describe, expect, it, vi } from 'vitest'

import root from '../src/root.js'

describe('root', () => {
  let spyCwd: ReturnType<typeof vi.spyOn>

  afterEach(() => {
    spyCwd.mockRestore()
  })

  it('返回根路径 "/"', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/')
    expect(root()).toBe('/')
  })

  it('路径末尾带斜杠、混合斜杠、Windows 路径均应规范化', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/test/project/')
    expect(root()).toBe('/Users/test/project')
    spyCwd.mockReturnValue('C:/Users\\test/project')
    expect(root()).toBe('/C:/Users/test/project')
    spyCwd.mockReturnValue('C:\\project')
    expect(root()).toBe('/C:/project')
    spyCwd.mockReturnValue('/Users/test/project')
    expect(root()).toBe('/Users/test/project')
    spyCwd.mockReturnValue('C:\\Users\\test\\project')
    expect(root()).toBe('/C:/Users/test/project')
  })

  it('路径为 undefined/null/空字符串应抛出异常', () => {
    spyCwd = vi
      .spyOn(process, 'cwd')
      .mockReturnValue(undefined as unknown as string)
    expect(() => root()).toThrow('Invalid path: path is empty')
    spyCwd.mockReturnValue(null as unknown as string)
    expect(() => root()).toThrow('Invalid path: path is empty')
    spyCwd.mockReturnValue('')
    expect(() => root()).toThrow('Invalid path: path is empty')
  })

  it('路径为相对路径应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('.')
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
    spyCwd.mockReturnValue('..')
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
    spyCwd.mockReturnValue('/Users/../project')
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
    spyCwd.mockReturnValue('/Users/./../project')
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
  })

  it('路径含非法字符应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/<test>/project')
    expect(() => root()).toThrow('Invalid path: contains forbidden characters')
    spyCwd.mockReturnValue('/Users/te|st/project')
    expect(() => root()).toThrow('Invalid path: contains forbidden characters')
  })
})
