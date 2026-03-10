import { Readable } from 'stream'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import download from '../src/download.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'

const TEMP_DIR = './temp/download'

type MockResponse = {
  arrayBuffer: () => Promise<ArrayBuffer>
  body: unknown
  ok: boolean
  statusText: string
}

const createBody = (data: number[] = []) =>
  Readable.toWeb(Readable.from([Buffer.from(data)]))

const createMockResponse = (data: number[] = []): MockResponse => ({
  ok: true,
  arrayBuffer: vi.fn().mockResolvedValue(new Uint8Array(data).buffer),
  body: createBody(data),
  statusText: 'OK',
})

const createFallbackResponse = (
  body: unknown,
  arrayBuffer: () => Promise<ArrayBuffer>,
): MockResponse => ({
  ok: true,
  arrayBuffer,
  body,
  statusText: 'OK',
})

const stubFetch = (data: number[] = []) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createMockResponse(data)))
}

const toArr = (buf: unknown): number[] => {
  if (buf === undefined || buf === null) return []
  if (typeof buf === 'string') return Array.from(Buffer.from(buf, 'binary'))
  return Array.from(buf as Uint8Array)
}

describe('download', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    vi.unstubAllGlobals()
    await remove(TEMP_DIR)
  })

  it('正常下载文件', async () => {
    const data = [1, 2, 3]
    stubFetch(data)
    const filename = 'file.txt'
    await download('http://test.com/file.txt', TEMP_DIR, filename)
    const buf = await read(`${TEMP_DIR}/${filename}`)
    expect(toArr(buf)).toEqual(data)
  })

  it('支持空文件', async () => {
    stubFetch([])
    const filename = 'empty.txt'
    await download('http://test.com/empty.txt', TEMP_DIR, filename)
    const buf = await read(`${TEMP_DIR}/${filename}`)
    expect(toArr(buf)).toEqual([])
  })

  it('自动推断文件名', async () => {
    stubFetch([7, 8])
    await download('http://test.com/auto.txt', TEMP_DIR)
    const buf = await read(`${TEMP_DIR}/auto.txt`)
    expect(toArr(buf)).toEqual([7, 8])
  })

  it('支持自定义文件名', async () => {
    stubFetch([4, 5, 6])
    await download('http://test.com/file.txt', TEMP_DIR, 'custom.txt')
    const buf = await read(`${TEMP_DIR}/custom.txt`)
    expect(toArr(buf)).toEqual([4, 5, 6])
  })

  it('支持特殊字符文件名', async () => {
    stubFetch([65, 66])
    const filename = '测试 文件.txt'
    await download('http://test.com/测试%20文件.txt', TEMP_DIR, filename)
    const buf = await read(`${TEMP_DIR}/${filename}`)
    expect(toArr(buf)).toEqual([65, 66])
  })

  it('多层嵌套目录自动创建', async () => {
    stubFetch([12, 13])
    const nestedDir = `${TEMP_DIR}/a/b/c/d`
    await download('http://test.com/nested.txt', nestedDir)
    const buf = await read(`${nestedDir}/nested.txt`)
    expect(toArr(buf)).toEqual([12, 13])
  })

  it('目录为绝对路径', async () => {
    stubFetch([14, 15])
    const absDir = `${TEMP_DIR}/abs`
    await mkdir(absDir)
    await download('http://test.com/abs.txt', absDir)
    const buf = await read(`${absDir}/abs.txt`)
    expect(toArr(buf)).toEqual([14, 15])
  })

  it('无 url 抛 TypeError', async () => {
    await expect(download('', TEMP_DIR)).rejects.toThrow(
      'download: url is required',
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
      arrayBuffer: vi.fn(),
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('Not Found')
  })

  it('fetch 响应无 body 抛 Error', async () => {
    const mockResponse = createFallbackResponse(
      null,
      vi.fn().mockResolvedValue(new Uint8Array().buffer),
    )
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
    const mockResponse = createFallbackResponse(
      {},
      vi.fn().mockRejectedValue(new Error('arrayBuffer error')),
    )
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await expect(download('http://test.com/err.txt', TEMP_DIR)).rejects.toThrow(
      'arrayBuffer error',
    )
  })

  it('优先使用响应流而不是 arrayBuffer', async () => {
    const arrayBuffer = vi
      .fn()
      .mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
    const mockResponse = createFallbackResponse(
      createBody([1, 2, 3]),
      arrayBuffer,
    )

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse))
    await download('http://test.com/stream.txt', TEMP_DIR)

    expect(arrayBuffer).not.toHaveBeenCalled()
    expect(toArr(await read(`${TEMP_DIR}/stream.txt`))).toEqual([1, 2, 3])
  })

  it('同名文件覆盖', async () => {
    const data1 = [9, 9, 9]
    const data2 = [8, 8, 8]
    const coverFilename = 'cover.txt'
    // 第一次
    stubFetch(data1)
    await download('http://test.com/cover.txt', TEMP_DIR, coverFilename)
    let buf = await read(`${TEMP_DIR}/${coverFilename}`)
    expect(toArr(buf)).toEqual(data1)
    // 第二次覆盖
    stubFetch(data2)
    await download('http://test.com/cover.txt', TEMP_DIR, coverFilename)
    buf = await read(`${TEMP_DIR}/${coverFilename}`)
    expect(toArr(buf)).toEqual(data2)
  })
})
