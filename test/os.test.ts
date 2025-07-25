import { afterEach, describe, expect, it } from 'vitest'

import os from '../src/os.js'

describe('os', () => {
  const originalPlatform = process.platform

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true,
      writable: true,
    })
  })

  const setPlatform = (value: unknown) => {
    Object.defineProperty(process, 'platform', {
      value,
      configurable: true,
      writable: true,
    })
  }

  it('应识别 macOS/Darwin 系统', () => {
    setPlatform('darwin')
    expect(os()).toBe('macos')

    setPlatform('Darwin')
    expect(os()).toBe('macos')

    setPlatform('darwin-arm64')
    expect(os()).toBe('macos')
  })

  it('应识别 Windows 系统', () => {
    setPlatform('win32')
    expect(os()).toBe('windows')

    setPlatform('WIN32')
    expect(os()).toBe('windows')

    setPlatform('windows')
    expect(os()).toBe('windows')
  })

  it('应返回 unknown 对于未知系统', () => {
    setPlatform('linux')
    expect(os()).toBe('unknown')

    setPlatform('freebsd')
    expect(os()).toBe('unknown')

    setPlatform('aix')
    expect(os()).toBe('unknown')
  })

  it('应处理无效的 platform 值', () => {
    setPlatform('')
    expect(os()).toBe('unknown')

    setPlatform(undefined)
    expect(os()).toBe('unknown')

    setPlatform(null)
    expect(os()).toBe('unknown')

    setPlatform(123)
    expect(os()).toBe('unknown')
  })

  it('应返回正确的类型', () => {
    const result = os()
    expect(typeof result).toBe('string')
    expect(['macos', 'windows', 'unknown']).toContain(result)
  })
})
