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

  const setPlatform = (value: string | undefined | null) => {
    Object.defineProperty(process, 'platform', {
      value,
      configurable: true,
      writable: true,
    })
  }

  it('macOS/Darwin 识别', () => {
    setPlatform('darwin')
    expect(os()).toBe('macos')
    setPlatform('Darwin')
    expect(os()).toBe('macos')
    setPlatform('darwin-arm64')
    expect(os()).toBe('macos')
  })

  it('Windows 识别', () => {
    setPlatform('win32')
    expect(os()).toBe('windows')
    setPlatform('WIN32')
    expect(os()).toBe('windows')
    setPlatform('windows')
    expect(os()).toBe('windows')
  })

  it('未知系统与异常类型', () => {
    setPlatform('linux')
    expect(os()).toBe('unknown')
    setPlatform('freebsd')
    expect(os()).toBe('unknown')
    setPlatform('')
    expect(os()).toBe('unknown')
    setPlatform(undefined)
    expect(os()).toBe('unknown')
    setPlatform(null)
    expect(os()).toBe('unknown')
  })

  it('返回值类型校验', () => {
    const result = os()
    expect(typeof result).toBe('string')
    expect(['macos', 'windows', 'unknown']).toContain(result)
  })
})
