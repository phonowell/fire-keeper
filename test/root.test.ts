import { afterEach, describe, expect, it, vi } from 'vitest'

import root from '../src/root.js'

const mockOs = (osType: string) => {
  vi.mock('../src/os.js', () => ({
    default: () => osType,
  }))
}

describe('root', () => {
  let spyCwd: ReturnType<typeof vi.spyOn>

  afterEach(() => {
    spyCwd?.mockRestore?.()
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('应返回 Unix 根路径 "/"', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('/')
  })

  it('应返回 Windows 根路径 "/"', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/')
    mockOs('windows')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('/')
  })

  it('路径末尾带斜杠应规范化', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/test/project/')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('/Users/test/project')
  })

  it('路径含混合斜杠应规范化', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('C:/Users\\test/project')
    mockOs('windows')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('C:/Users/test/project')
  })

  it('路径为单一目录应返回规范化绝对路径', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/project')
    spyOs = vi.spyOn(os, undefined).mockReturnValue('unix')
    expect(root()).toBe('/project')
  })

  it('Windows 单一目录应返回规范化绝对路径', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('C:\\project')
    spyOs = vi.spyOn(os, 'default').mockReturnValue('windows')
    expect(root()).toBe('C:/project')
  })

  it('路径为 undefined 应抛出异常', () => {
    spyCwd = vi
      .spyOn(process, 'cwd')
      .mockReturnValue(undefined as unknown as string)
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(() => root()).toThrow('Invalid path: path is empty')
  })

  it('路径为 null 应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue(null as unknown as string)
    spyOs = vi.spyOn(os, undefined).mockReturnValue('unix')
    expect(() => root()).toThrow('Invalid path: path is empty')
  })

  it('应返回 Unix 规范化绝对路径', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/test/project')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('/Users/test/project')
  })

  it('应返回 Windows 规范化绝对路径', () => {
    spyCwd = vi
      .spyOn(process, 'cwd')
      .mockReturnValue('C:\\Users\\test\\project')
    mockOs('windows')
    const root = (await import('../src/root.js')).default
    expect(root()).toBe('C:/Users/test/project')
  })

  it('应返回 Windows 根路径', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('C:\\')
    spyOs = vi.spyOn(os, undefined).mockReturnValue('windows')
    expect(root()).toBe('C:/')
  })

  it('路径为空应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('')
    spyOs = vi.spyOn(os, undefined).mockReturnValue('unix')
    expect(() => root()).toThrow('Invalid path: path is empty')
  })

  it('路径仅为 "." 应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('.')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
  })

  it('路径仅为 ".." 应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('..')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
  })

  it('路径含非法字符应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/<test>/project')
    spyOs = vi.spyOn(os, undefined).mockReturnValue('unix')
    expect(() => root()).toThrow('Invalid path: contains forbidden characters')
  })

  it('路径含多个非法字符应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/te|st/project')
    spyOs = vi.spyOn(os, undefined).mockReturnValue('unix')
    expect(() => root()).toThrow('Invalid path: contains forbidden characters')
  })

  it('路径含相对组件应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/../project')
    mockOs('unix')
    const root = (await import('../src/root.js')).default
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
  })

  it('路径含多个相对组件应抛出异常', () => {
    spyCwd = vi.spyOn(process, 'cwd').mockReturnValue('/Users/./../project')
    stubOs('unix')
    expect(() => root()).toThrow(
      'Invalid path: contains relative path components',
    )
  })
})
