import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import download from '../src/download.js'

import type { PathLike } from 'fs'

const TEMP_DIR = 'temp/download-test'

describe('download', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let ensureDirMock: ReturnType<typeof vi.spyOn> & {
    mockResolvedValue: typeof vi.fn
    mockRejectedValueOnce: typeof vi.fn
  }
  let createWriteStreamMock: ReturnType<typeof vi.spyOn> & {
    mockImplementation: typeof vi.fn
    mockImplementationOnce: typeof vi.fn
  }
  let echoMock: ReturnType<typeof vi.fn>
  let fileBuffer: Buffer | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock = vi.fn()
    global.fetch = fetchMock as typeof fetch
    ensureDirMock = vi.spyOn(fse, 'ensureDir') as typeof ensureDirMock
    ensureDirMock.mockResolvedValue(undefined)
    fileBuffer = undefined
    createWriteStreamMock = vi.spyOn(
      fse,
      'createWriteStream',
    ) as typeof createWriteStreamMock
    createWriteStreamMock.mockImplementation(
      (filePath: PathLike) =>
        Object.assign(vi.fn(), {
          on: vi.fn(),
          once: vi.fn(),
          emit: vi.fn(),
          end: vi.fn(),
          write: vi.fn((chunk: Buffer) => {
            fileBuffer = chunk
            return true
          }),
          close: vi.fn(),
          pipe: vi.fn(),
          destroy: vi.fn(),
          writable: true,
          writableEnded: false,
          writableFinished: false,
          writableHighWaterMark: 16384,
          writableLength: 0,
          writableObjectMode: false,
          cork: vi.fn(),
          uncork: vi.fn(),
          setDefaultEncoding: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          removeAllListeners: vi.fn(),
          getMaxListeners: vi.fn(),
          setMaxListeners: vi.fn(),
          listeners: vi.fn(),
          rawListeners: vi.fn(),
          off: vi.fn(),
          prependListener: vi.fn(),
          prependOnceListener: vi.fn(),
          eventNames: vi.fn(),
          path: filePath,
        }) as unknown as NodeJS.WriteStream,
    )
    echoMock = vi.fn()
  })

  afterEach(async () => {
    await fse.remove(TEMP_DIR)
  })

  it('应正常下载文件', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([1, 2, 3]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/file.txt', TEMP_DIR)
    expect(ensureDirMock).toHaveBeenCalledWith(TEMP_DIR)
    expect(createWriteStreamMock).toHaveBeenCalled()
    expect(echoMock).toHaveBeenCalledWith(
      'download',
      expect.stringContaining('downloaded'),
    )
    expect(fileBuffer).toEqual(Buffer.from([1, 2, 3]))
  })

  it('应支持下载空文件', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/empty.txt', TEMP_DIR)
    expect(fileBuffer).toEqual(Buffer.from([]))
  })

  it('应支持下载大文件', async () => {
    const bigArr = new Uint8Array(1024 * 1024).map(() => 123)
    const mockResponse = {
      ok: true,
      arrayBuffer: () => bigArr.buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/big.bin', TEMP_DIR)
    expect(fileBuffer?.length).toBe(1024 * 1024)
    expect(fileBuffer?.[0]).toBe(123)
  })

  it('应支持特殊字符文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([65, 66]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    const filename = '测试 文件.txt'
    await download('http://test.com/测试%20文件.txt', TEMP_DIR, filename)
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      path.join(TEMP_DIR, filename),
    )
    expect(fileBuffer).toEqual(Buffer.from([65, 66]))
  })

  it('应自动推断文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([77, 88]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/auto.txt', TEMP_DIR)
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      path.join(TEMP_DIR, 'auto.txt'),
    )
    expect(fileBuffer).toEqual(Buffer.from([77, 88]))
  })

  it('应支持自定义文件名', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([4, 5, 6]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/file.txt', 'dist', 'custom.txt')
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      expect.stringContaining('custom.txt'),
    )
    expect(echoMock).toHaveBeenCalledWith(
      'download',
      expect.stringContaining('custom.txt'),
    )
  })

  it('目录应自动归一化', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([7, 8, 9]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/file.txt', 'dist//subdir')
    expect(ensureDirMock).toHaveBeenCalledWith('dist/subdir')
  })

  it('pipeline 异常应抛出 Error', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([1, 2, 3]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    // 模拟 pipeline 抛错
    createWriteStreamMock.mockImplementationOnce(() => {
      throw new Error('write error')
    })
    await expect(download('http://test.com/file.txt', 'dist')).rejects.toThrow(
      'write error',
    )
  })

  it('目标目录无写权限应抛出 Error', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([1, 2, 3]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    ensureDirMock.mockRejectedValueOnce(new Error('EACCES: permission denied'))
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('EACCES: permission denied')
  })

  it('fetch 超时应抛出 Error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network timeout'))
    await expect(
      download('http://test.com/file.txt', TEMP_DIR),
    ).rejects.toThrow('network timeout')
  })

  it('同名文件覆盖应正常', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([9, 9, 9]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    // 第一次下载
    await download('http://test.com/cover.txt', TEMP_DIR)
    expect(fileBuffer).toEqual(Buffer.from([9, 9, 9]))
    // 第二次下载（覆盖）
    await download('http://test.com/cover.txt', TEMP_DIR)
    expect(fileBuffer).toEqual(Buffer.from([9, 9, 9]))
  })

  it('文件名包含路径分隔符应正常处理', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([1, 2]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    const filename = 'a/b/c.txt'
    await download('http://test.com/a%2Fb%2Fc.txt', TEMP_DIR, filename)
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      path.join(TEMP_DIR, filename),
    )
    expect(fileBuffer).toEqual(Buffer.from([1, 2]))
  })

  it('文件名包含 emoji/空格/中文混合应正常处理', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([10, 11]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    const filename = '测试 😃 文件 2025.txt'
    await download(
      'http://test.com/测试%20😃%20文件%202025.txt',
      TEMP_DIR,
      filename,
    )
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      path.join(TEMP_DIR, filename),
    )
    expect(fileBuffer).toEqual(Buffer.from([10, 11]))
  })

  it('多层嵌套目录应自动创建', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([12, 13]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    const nestedDir = path.join(TEMP_DIR, 'a/b/c/d')
    await download('http://test.com/nested.txt', nestedDir)
    expect(ensureDirMock).toHaveBeenCalledWith(nestedDir)
    expect(fileBuffer).toEqual(Buffer.from([12, 13]))
  })

  it('目录为绝对路径应正常处理', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([14, 15]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    const absDir = path.resolve(TEMP_DIR, 'abs')
    await download('http://test.com/abs.txt', absDir)
    expect(ensureDirMock).toHaveBeenCalledWith(absDir)
    expect(fileBuffer).toEqual(Buffer.from([14, 15]))
  })

  it('filename 为空字符串应自动推断', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => new Uint8Array([16, 17]).buffer,
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await download('http://test.com/auto2.txt', TEMP_DIR, '')
    expect(createWriteStreamMock).toHaveBeenCalledWith(
      path.join(TEMP_DIR, 'auto2.txt'),
    )
    expect(fileBuffer).toEqual(Buffer.from([16, 17]))
  })

  it('fetch 返回 arrayBuffer 抛异常应抛出 Error', async () => {
    const mockResponse = {
      ok: true,
      arrayBuffer: () => {
        throw new Error('arrayBuffer error')
      },
      body: {},
      statusText: 'OK',
    }
    fetchMock.mockResolvedValue(mockResponse)
    await expect(download('http://test.com/err.txt', TEMP_DIR)).rejects.toThrow(
      'arrayBuffer error',
    )
  })

  it('无 url 应抛出 TypeError', async () => {
    await expect(download('', 'dist')).rejects.toThrow('url is required')
  })

  it('无 dir 应抛出 TypeError', async () => {
    await expect(download('http://test.com/file.txt', '')).rejects.toThrow(
      'dir is required',
    )
  })

  it('fetch 响应非 ok 应抛出 Error', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      body: {},
    })
    await expect(download('http://test.com/file.txt', 'dist')).rejects.toThrow(
      'Not Found',
    )
  })

  it('fetch 响应无 body 应抛出 Error', async () => {
    fetchMock.mockResolvedValue({ ok: true, body: null, statusText: 'OK' })
    await expect(download('http://test.com/file.txt', 'dist')).rejects.toThrow(
      'response has no body',
    )
  })
})
