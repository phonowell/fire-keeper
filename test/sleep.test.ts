// Vitest 单元测试：sleep.ts
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
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await sleep()
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('正整数延迟应等待并输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const start = Date.now()
    await sleep(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(95)
    expect(logSpy).toHaveBeenCalledWith('sleep', "slept '100 ms'")
    logSpy.mockRestore()
  })

  it('负数延迟应视为0，无日志输出', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const start = Date.now()
    await sleep(-50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(20)
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('浮点数延迟应等待并输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const start = Date.now()
    await sleep(55.5)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(50)
    expect(logSpy).toHaveBeenCalledWith('sleep', "slept '55.5 ms'")
    logSpy.mockRestore()
  })

  it('delay=0 不输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await sleep(0)
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('极大值应等待并输出日志', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const start = Date.now()
    await sleep(200)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(195)
    expect(logSpy).toHaveBeenCalledWith('sleep', "slept '200 ms'")
    logSpy.mockRestore()
  })

  it('NaN参数应视为0，无日志输出', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await sleep(NaN)
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('字符串参数应视为0，无日志输出', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    // @ts-expect-error 测试类型安全
    await sleep('100')
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('undefined参数应视为0，无日志输出', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    // @ts-expect-error 测试类型安全
    await sleep(undefined)
    expect(logSpy).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('Promise链式调用应正常工作', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const start = Date.now()
    await sleep(30).then(() => sleep(40))
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(65)
    logSpy.mockRestore()
  })
})
