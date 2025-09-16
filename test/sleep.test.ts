import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import sleep from '../src/sleep.js'

describe('sleep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    echo.isSilent = false
    echo.isFrozen = false
  })

  it('默认参数应立即返回，无日志输出', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
    await sleep()
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('正数延迟应等待并输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(45)
    expect(logSpy).toHaveBeenCalled()
    expect(logSpy.mock.calls[0][0]).toContain('slept 50 ms')
    logSpy.mockRestore()
  })

  it('负数、NaN、0参数应立即返回且无日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
    const start = Date.now()
    await sleep(-10)
    await sleep(NaN)
    await sleep(0)
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(50)
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('浮点数延迟应等待并输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
    const start = Date.now()
    await sleep(25.5)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(20)
    expect(logSpy).toHaveBeenCalled()
    expect(logSpy.mock.calls[0][0]).toContain('slept 25.5 ms')
    logSpy.mockRestore()
  })

  it('Promise链式调用应正常工作', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
    const start = Date.now()
    await sleep(20).then(() => sleep(30))
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(45)
    logSpy.mockRestore()
  })
})
