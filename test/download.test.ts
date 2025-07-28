import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import download from '../src/download.js'

const TEMP_DIR = 'temp/download-test'

describe('download', () => {
  beforeEach(async () => {
    await fse.remove(TEMP_DIR)
    await fse.ensureDir(TEMP_DIR)
  })

  afterEach(async () => {
    await fse.remove(TEMP_DIR)
  })

  it('正常下载文件', async () => {
    const data = [1, 2, 3]
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array(data).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const filename = 'file.txt'
    await download('http://test.com/file.txt', TEMP_DIR, filename)
    const filePath = path.join(TEMP_DIR, filename)
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual(data)
  })

  it('支持空文件', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const filename = 'empty.txt'
    await download('http://test.com/empty.txt', TEMP_DIR, filename)
    const filePath = path.join(TEMP_DIR, filename)
    const buf = await fse.readFile(filePath)
    expect(buf.length).toBe(0)
  })

  it('自动推断文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([7, 8]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await download('http://test.com/auto.txt', TEMP_DIR)
    const filePath = path.join(TEMP_DIR, 'auto.txt')
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual([7, 8])
  })

  it('支持自定义文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([4, 5, 6]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await download('http://test.com/file.txt', TEMP_DIR, 'custom.txt')
    const filePath = path.join(TEMP_DIR, 'custom.txt')
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual([4, 5, 6])
  })

  it('支持特殊字符文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([65, 66]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const filename = '测试 文件.txt'
    await download('http://test.com/测试%20文件.txt', TEMP_DIR, filename)
    const filePath = path.join(TEMP_DIR, filename)
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual([65, 66])
  })

  it('多层嵌套目录自动创建', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([12, 13]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const nestedDir = path.join(TEMP_DIR, 'a/b/c/d')
    await download('http://test.com/nested.txt', nestedDir)
    const filePath = path.join(nestedDir, 'nested.txt')
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual([12, 13])
  })

  it('目录为绝对路径', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([14, 15]).buffer,
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    const absDir = path.resolve(TEMP_DIR, 'abs')
    await download('http://test.com/abs.txt', absDir)
    const filePath = path.join(absDir, 'abs.txt')
    const buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual([14, 15])
  })

  it('无 url 抛 TypeError', async () => {
    await expect(download('', TEMP_DIR)).rejects.toThrow(
      'getName/error: empty input',
    )
  })

  it('无 dir 抛 TypeError', async () => {
    await expect(download('http://test.com/file.txt', '')).rejects.toThrow(
      'download: dir is required',
    )
  })

  it('fetch 响应非 ok 抛 Error', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
      body: {},
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('Not Found')
  })

  it('fetch 响应无 body 抛 Error', async () => {
    const mockResponse = {
      ok: true,
      body: null,
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('download: response has no body')
  })

  it('fetch 抛异常', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network error')),
    )
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('network error')
  })

  it('fetch 返回 arrayBuffer 抛异常', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => {
        throw new Error('arrayBuffer error')
      },
      body: {},
      statusText: 'OK',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await expect(download('http://test.com/err.txt', TEMP_DIR)).rejects.toThrow(
      'arrayBuffer error',
    )
  })

  it('同名文件覆盖', async () => {
    const data1 = [9, 9, 9]
    const data2 = [8, 8, 8]
    const filename = 'cover.txt'
    const filePath = path.join(TEMP_DIR, filename)
    // 第一次
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => new Uint8Array(data1).buffer,
        body: {},
        statusText: 'OK',
      }),
    )
    await download('http://test.com/cover.txt', TEMP_DIR, filename)
    let buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual(data1)
    // 第二次覆盖
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => new Uint8Array(data2).buffer,
        body: {},
        statusText: 'OK',
      }),
    )
    await download('http://test.com/cover.txt', TEMP_DIR, filename)
    buf = await fse.readFile(filePath)
    expect(Array.from(buf)).toEqual(data2)
  })
})
