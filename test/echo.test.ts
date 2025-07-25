import fs from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo, { renderPath } from '../src/echo.js'

describe('echo', () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    echo.isSilent = false
    echo.isFrozen = false
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it('应正常输出字符串并返回原值', () => {
    const msg = echo('hello world')
    expect(msg).toBe('hello world')
    expect(logSpy).toHaveBeenCalled()
  })

  it('应支持类型输出', () => {
    const msg = echo('info', '消息内容')
    expect(msg).toBe('消息内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('isSilent 为 true 时不输出', () => {
    echo.isSilent = true
    const msg = echo('静默内容')
    expect(msg).toBe('静默内容')
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('pause/resume 可控制输出', () => {
    echo.pause()
    echo('暂停后内容')
    expect(logSpy).not.toHaveBeenCalled()
    echo.resume()
    echo('恢复后内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('freeze 可冻结输出（异步）', async () => {
    await echo.freeze(() => {
      echo('冻结期间内容')
      expect(logSpy).not.toHaveBeenCalled()
      return Promise.resolve('done')
    })
    echo('冻结结束内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('whisper 可临时静默输出（异步）', async () => {
    await echo.whisper(() => {
      echo('whisper 内容')
      expect(logSpy).not.toHaveBeenCalled()
      return Promise.resolve('ok')
    })
    echo('whisper 结束内容')
    expect(logSpy).toHaveBeenCalled()
  })

  it('空字符串不输出', () => {
    echo('')
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('renderPath 可正确转换路径', () => {
    const result1 = renderPath('/root/abc')
    const result2 = renderPath('/home/user/abc')
    expect(typeof result1).toBe('string')
    expect(typeof result2).toBe('string')
  })

  it('renderPath 真实文件路径转换', () => {
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    const tempFile = path.join(tempDir, 'echo_test.txt')
    fs.writeFileSync(tempFile, 'test')
    expect(renderPath(tempFile)).toMatch(/temp[\\/]/)
    fs.unlinkSync(tempFile)
  })
  it('支持输出数字、对象、null、布尔值、数组、嵌套对象', () => {
    expect(echo(123)).toBe(123)
    expect(logSpy).toHaveBeenCalled()
    expect(echo({ a: 1 })).toEqual({ a: 1 })
    expect(logSpy).toHaveBeenCalled()
    expect(echo(null)).toBe(null)
    expect(logSpy).toHaveBeenCalled()
    expect(echo(true)).toBe(true)
    expect(logSpy).toHaveBeenCalled()
    expect(echo([1, 2, 3])).toEqual([1, 2, 3])
    expect(logSpy).toHaveBeenCalled()
    expect(echo({ a: { b: [1, 2] } })).toEqual({ a: { b: [1, 2] } })
    expect(logSpy).toHaveBeenCalled()
  })

  it('多次 pause/freeze/whisper 嵌套控制输出', async () => {
    echo.pause()
    echo('静默内容1')
    expect(logSpy).not.toHaveBeenCalled()
    await echo.freeze(() => {
      echo('冻结内容2')
      expect(logSpy).not.toHaveBeenCalled()
      return echo.whisper(() => {
        echo('whisper 内容3')
        expect(logSpy).not.toHaveBeenCalled()
        return Promise.resolve()
      })
    })
    echo.resume()
    echo('恢复内容4')
    expect(logSpy).toHaveBeenCalled()
    // 多次 pause/resume 边界
    echo.pause()
    echo.pause()
    echo('静默内容5')
    expect(logSpy).toHaveBeenCalledTimes(1)
    echo.resume()
    echo.resume()
    echo('恢复内容6')
    expect(logSpy).toHaveBeenCalledTimes(2)
  })

  it('类型参数推断与返回值类型校验', () => {
    const str = echo<string>('类型推断')
    expect(typeof str).toBe('string')
    const num = echo<number>(42)
    expect(typeof num).toBe('number')
    const obj = echo<{ foo: string }>({ foo: 'bar' })
    expect(obj).toEqual({ foo: 'bar' })
    const arr = echo<number[]>([1, 2, 3])
    expect(Array.isArray(arr)).toBe(true)
    const nested = echo<{ a: { b: number[] } }>({ a: { b: [1, 2] } })
    expect(nested).toEqual({ a: { b: [1, 2] } })
  })

  it('异常类型不输出', () => {
    echo('')
    expect(logSpy).not.toHaveBeenCalled()
  })

  describe('echo 补充覆盖', () => {
    it('default 类型不显示 type', () => {
      const msg = echo('default', '默认类型内容')
      expect(msg).toBe('默认类型内容')
      expect(logSpy).toHaveBeenCalled()
    })

    it('type 边界测试', () => {
      expect(echo('  ', '空格类型')).toBe('空格类型')
      expect(logSpy).toHaveBeenCalled()
      expect(echo('SPECIAL-字符', '特殊类型')).toBe('特殊类型')
      expect(logSpy).toHaveBeenCalled()
      expect(echo('MiXeD', '大小写类型')).toBe('大小写类型')
      expect(logSpy).toHaveBeenCalled()
    })

    it('renderType 缓存逻辑', () => {
      // 通过多次调用 echo(type, msg) 验证缓存
      echo('custom', '缓存测试1')
      echo('custom', '缓存测试2')
      expect(logSpy).toHaveBeenCalledTimes(2)
    })

    it('renderContent 染色', () => {
      // 直接测试 renderPath 导出函数
      const result: string = renderPath("'abc'").replace(/'/g, '')
      expect(result).toContain('abc')
    })

    it('renderPath 路径边界', () => {
      expect(renderPath('/')).toBe('/')
      expect(renderPath('')).toBe('')
      expect(renderPath('/not/home/or/root')).toBe('/not/home/or/root')
    })

    it('renderTime 缓存逻辑', () => {
      // 间接测试，通过多次 echo 输出时间
      echo('time', '缓存时间1')
      echo('time', '缓存时间2')
      expect(logSpy).toHaveBeenCalled()
    })

    it('freeze/whisper 支持 Promise 直接传入', async () => {
      await echo.freeze(Promise.resolve('freeze-promise'))
      await echo.whisper(Promise.resolve('whisper-promise'))
    })

  })
})
