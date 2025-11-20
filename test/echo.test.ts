import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo, { renderPath } from '../src/echo.js'

describe('echo', () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    echo.isSilent = false
    echo.isFrozen = false
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0)
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('基本输出与空字符串不输出', () => {
    expect(echo('hello')).toBe('hello')
    expect(logSpy).toHaveBeenCalled()
    expect(echo('info', '消息')).toBe('消息')
    expect(logSpy).toHaveBeenCalled()
    logSpy.mockClear()
    echo('')
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('isSilent为true时不输出', () => {
    echo.isSilent = true
    expect(echo('静默内容')).toBe('静默内容')
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('pause/resume控制输出', () => {
    echo.pause()
    echo('暂停后内容')
    expect(logSpy).not.toHaveBeenCalled()
    echo.resume()
    echo('恢复后内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('freeze冻结输出（异步）', async () => {
    await echo.freeze(() => {
      echo('冻结期间内容')
      expect(logSpy).not.toHaveBeenCalled()
      return Promise.resolve('done')
    })
    echo('冻结结束内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('whisper临时静默输出（异步）', async () => {
    await echo.whisper(() => {
      echo('whisper内容')
      expect(logSpy).not.toHaveBeenCalled()
      return Promise.resolve('ok')
    })
    echo('whisper结束内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('renderPath 路径转换', () => {
    expect(renderPath('/')).toBe('/')
    expect(renderPath('')).toBe('')
    expect(renderPath('/not/home/or/root')).toBe('/not/home/or/root')
    expect(renderPath('./package.json')).toMatch(/package\.json/)
  })

  it('支持自定义类型标签', () => {
    expect(echo('custom-type', '自定义内容')).toBe('自定义内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('freeze/whisper支持Promise直接传入', async () => {
    await echo.freeze(Promise.resolve('freeze-promise'))
    await echo.whisper(Promise.resolve('whisper-promise'))
  })
})
