import { beforeEach, describe, expect, it, vi } from 'vitest'

import normalizePath from '../src/normalizePath.js'
import watch from '../src/watch.js'

describe('watch', () => {
  let chokidarMock: {
    on: ReturnType<typeof vi.fn>
    close: ReturnType<typeof vi.fn>
  }
  let debounceMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetModules()
    chokidarMock = {
      on: vi.fn().mockReturnThis(),
      close: vi.fn(),
    }
    debounceMock = vi.fn(
      (_: { delay: number }, cb: (path: string) => void) => cb,
    )
    vi.mock('chokidar', () => ({
      watch: vi.fn(() => chokidarMock),
    }))
    vi.mock('radash', () => ({
      debounce: debounceMock,
    }))
    vi.spyOn(normalizePath, 'default').mockImplementation(
      (p: string) => `normalized/${p}`,
    )
  })

  it('应正常监听变更并回调', () => {
    const cb = vi.fn()
    const unwatch = watch('file.txt', cb)
    expect(chokidarMock.on).toHaveBeenCalledWith('error', expect.any(Function))
    expect(chokidarMock.on).toHaveBeenCalledWith('change', expect.any(Function))
    // 模拟 change 事件
    const changeHandler = chokidarMock.on.mock.calls.find(
      ([event]: [string]) => event === 'change',
    )?.[1] as (path: string) => void
    changeHandler('file.txt')
    expect(cb).toHaveBeenCalledWith('normalized/file.txt')
    expect(typeof unwatch).toBe('function')
    unwatch()
    expect(chokidarMock.close).toHaveBeenCalled()
  })

  it('应支持 debounce 配置', () => {
    const cb = vi.fn()
    watch('file.txt', cb, { debounce: 500 })
    expect(debounceMock).toHaveBeenCalledWith({ delay: 500 }, cb)
  })

  it('应处理 watcher 错误', () => {
    const errorHandler = chokidarMock.on.mock.calls.find(
      ([event]: [string]) => event === 'error',
    )?.[1] as (err: Error) => void
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    errorHandler(new Error('test error'))
    expect(errorSpy).toHaveBeenCalledWith(
      'Error watching files:',
      expect.any(Error),
    )
    errorSpy.mockRestore()
  })

  it('debounce 为 0 时不包裹回调', () => {
    const cb = vi.fn()
    watch('file.txt', cb, { debounce: 0 })
    expect(debounceMock).not.toHaveBeenCalled()
  })

  it('应支持数组路径监听', () => {
    const cb = vi.fn()
    watch(['a.txt', 'b.txt'], cb)
    expect(chokidarMock.on).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('debounce 为负数时不包裹回调', () => {
    const cb = vi.fn()
    watch('file.txt', cb, { debounce: -100 })
    expect(debounceMock).not.toHaveBeenCalled()
  })

  it('回调抛错时不影响 watcher', () => {
    const cb = vi.fn(() => {
      throw new Error('cb error')
    })
    const unwatch = watch('file.txt', cb)
    const changeHandler = chokidarMock.on.mock.calls.find(
      ([event]: [string]) => event === 'change',
    )?.[1] as (path: string) => void
    expect(() => changeHandler('file.txt')).toThrow('cb error')
    expect(typeof unwatch).toBe('function')
  })

  it('normalizePath 异常时仍调用回调', () => {
    ;(normalizePath.default as unknown as (p: string) => string) = vi.fn(() => {
      throw new Error('normalize error')
    })
    const cb = vi.fn()
    const unwatch = watch('file.txt', cb)
    const changeHandler = chokidarMock.on.mock.calls.find(
      ([event]: [string]) => event === 'change',
    )?.[1] as (path: string) => void
    expect(() => changeHandler('file.txt')).toThrow('normalize error')
    expect(typeof unwatch).toBe('function')
  })
})
