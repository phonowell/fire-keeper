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

  it('基本类型输出与空字符串不输出', () => {
    expect(echo('hello')).toBe('hello')
    expect(logSpy).toHaveBeenCalled()
    expect(echo('info', '消息')).toBe('消息')
    expect(logSpy).toHaveBeenCalled()
    expect(echo(123)).toBe(123)
    expect(logSpy).toHaveBeenCalled()
    expect(echo({ a: 1 })).toEqual({ a: 1 })
    expect(logSpy).toHaveBeenCalled()
    expect(echo([1, 2, 3])).toEqual([1, 2, 3])
    expect(logSpy).toHaveBeenCalled()
    expect(echo(null)).toBe(null)
    expect(logSpy).toHaveBeenCalled()
    expect(echo(true)).toBe(true)
    expect(logSpy).toHaveBeenCalled()
    echo('')
    expect(logSpy).toHaveBeenCalledTimes(7)
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

  it('default类型与边界', () => {
    expect(echo('default', '默认类型内容')).toBe('默认类型内容')
    expect(logSpy).toHaveBeenCalled()
    expect(echo('  ', '空格类型')).toBe('空格类型')
    expect(logSpy).toHaveBeenCalled()
    expect(echo('SPECIAL-字符', '特殊类型')).toBe('特殊类型')
    expect(logSpy).toHaveBeenCalled()
    expect(echo('MiXeD', '大小写类型')).toBe('大小写类型')
    expect(logSpy).toHaveBeenCalled()
  })

  it('freeze/whisper支持Promise直接传入', async () => {
    await echo.freeze(Promise.resolve('freeze-promise'))
    await echo.whisper(Promise.resolve('whisper-promise'))
  })
})
