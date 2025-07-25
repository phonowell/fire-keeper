import fs from 'fs'

import archiver from 'archiver'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import zip from '../src/zip.js'

type ArchiverMock = {
  pipe: () => void
  file: (src: string, opts: { name: string }) => void
  finalize: () => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
}

describe('zip', () => {
  let archiverMock: ArchiverMock

  beforeEach(() => {
    vi.clearAllMocks()
    archiverMock = {
      pipe: vi.fn(),
      file: vi.fn(),
      finalize: vi.fn(),
      on: vi.fn(),
    }
    vi.spyOn(archiver, 'default').mockReturnValue(archiverMock as unknown)
    vi.spyOn(fs, 'createWriteStream').mockReturnValue({} as unknown)
    vi.spyOn(echo, 'default').mockImplementation(() => {})
  })

  it('应正常压缩单个目录', async () => {
    await zip('src', 'dist', 'archive.zip')
    expect(archiver.default).toHaveBeenCalled()
    expect(fs.createWriteStream).toHaveBeenCalled()
    expect(echo.default).toHaveBeenCalledWith(
      'zip',
      expect.stringContaining('zipped'),
    )
  })

  it('应支持数组源压缩', async () => {
    await zip(['src', 'public'], 'dist', 'archive.zip')
    expect(archiver.default).toHaveBeenCalled()
    expect(fs.createWriteStream).toHaveBeenCalled()
  })

  it('应支持 option 对象参数', async () => {
    await zip('src', 'dist', { base: 'src', filename: 'archive.zip' })
    expect(archiver.default).toHaveBeenCalled()
    expect(fs.createWriteStream).toHaveBeenCalled()
  })

  it('应自动推断文件名和 base', async () => {
    await zip('src', 'dist')
    expect(archiver.default).toHaveBeenCalled()
    expect(fs.createWriteStream).toHaveBeenCalled()
  })

  it('应支持空 source 抛出异常', async () => {
    await expect(zip('', 'dist', 'archive.zip')).rejects.toThrow()
  })

  it('应支持无 target 自动推断', async () => {
    await zip('src')
    expect(archiver.default).toHaveBeenCalled()
    expect(fs.createWriteStream).toHaveBeenCalled()
  })

  it('应处理 archiver error 事件', async () => {
    archiverMock.on = vi.fn((event, cb) => {
      if (event === 'error') cb(new Error('mock error'))
      return archiverMock
    })
    await expect(zip('src', 'dist', 'archive.zip')).rejects.toThrow(
      'mock error',
    )
  })

  it('应处理 archiver warning 事件', async () => {
    archiverMock.on = vi.fn((event, cb) => {
      if (event === 'warning') cb(new Error('mock warning'))
      return archiverMock
    })
    await expect(zip('src', 'dist', 'archive.zip')).rejects.toThrow(
      'mock warning',
    )
  })

  it('应处理进度事件', async () => {
    archiverMock.on = vi.fn((event, cb) => {
      if (event === 'progress')
        cb({ fs: { processedBytes: 50, totalBytes: 100 } })
      return archiverMock
    })
    await zip('src', 'dist', 'archive.zip')
    expect(archiver.default).toHaveBeenCalled()
  })
})
