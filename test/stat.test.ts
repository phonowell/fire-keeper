import fs from 'fs'
import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import glob from '../src/glob.js'
import stat from '../src/stat.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)

describe('stat - Mock 测试', () => {
  const mockedEcho = vi.mocked(echo)
  const mockedGlob = vi.mocked(glob)

  vi.mock('../src/echo.js')
  vi.mock('../src/glob.js')

  // 辅助函数创建带有标记的数组
  const createListSource = (files: string[]) => {
    const result = files as string[] & { __IS_LISTED_AS_SOURCE__: true }
    result.__IS_LISTED_AS_SOURCE__ = true
    return result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应返回文件的状态对象', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 1024,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['test.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('test.txt')

    expect(mockedGlob).toHaveBeenCalledWith('test.txt', { onlyFiles: false })
    expect(fsMock).toHaveBeenCalledWith('test.txt', expect.any(Function))
    expect(result).toBe(mockStats)
    expect(result?.isFile()).toBe(true)
    expect(result?.size).toBe(1024)

    fsMock.mockRestore()
  })

  it('应返回目录的状态对象', async () => {
    const mockStats = {
      isFile: () => false,
      isDirectory: () => true,
      isSymbolicLink: () => false,
      size: 0,
      mtime: new Date(),
      mode: 0o755,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['testdir']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('testdir')

    expect(result?.isDirectory()).toBe(true)
    expect(result?.isFile()).toBe(false)

    fsMock.mockRestore()
  })

  it('应返回符号链接目标的状态对象', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 512,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['symlink.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('symlink.txt')

    expect(result?.isFile()).toBe(true)
    expect(result?.size).toBe(512)

    fsMock.mockRestore()
  })

  it('glob 匹配多个文件时应返回第一个文件的状态', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 256,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['file1.txt', 'file2.txt', 'file3.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('*.txt')

    expect(mockedGlob).toHaveBeenCalledWith('*.txt', { onlyFiles: false })
    expect(fsMock).toHaveBeenCalledWith('file1.txt', expect.any(Function))
    expect(result).toBe(mockStats)

    fsMock.mockRestore()
  })

  it('文件不存在时应返回 null 并输出提示', async () => {
    mockedGlob.mockResolvedValue(createListSource([]))

    const result = await stat('notfound.txt')

    expect(result).toBeNull()
    expect(mockedEcho).toHaveBeenCalledWith(
      'stat',
      expect.stringContaining('notfound.txt')
    )
    expect(mockedEcho).toHaveBeenCalledWith(
      'stat',
      expect.stringContaining('not found')
    )
  })

  it('glob 匹配无结果时应返回 null', async () => {
    mockedGlob.mockResolvedValue(createListSource([]))

    const result = await stat('*.nonexistent')

    expect(result).toBeNull()
    expect(mockedEcho).toHaveBeenCalledWith(
      'stat',
      expect.stringContaining('not found')
    )
  })

  it('fs.stat 抛出错误时应正确传播', async () => {
    const error = Object.assign(new Error('permission denied'), { code: 'EPERM' })
    mockedGlob.mockResolvedValue(createListSource(['noperm.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(error)
    })

    await expect(stat('noperm.txt')).rejects.toThrow('permission denied')

    fsMock.mockRestore()
  })

  it('fs.stat 抛出 ENOENT 错误时应正确传播', async () => {
    const error = Object.assign(new Error('no such file'), { code: 'ENOENT' })
    mockedGlob.mockResolvedValue(createListSource(['missing.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(error)
    })

    await expect(stat('missing.txt')).rejects.toThrow('no such file')

    fsMock.mockRestore()
  })

  it('glob 抛出错误时应正确传播', async () => {
    mockedGlob.mockRejectedValue(new Error('glob error'))

    await expect(stat('*.txt')).rejects.toThrow('glob error')
  })

  it('应支持复杂的 glob 模式', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 128,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['src/test.ts']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('src/**/*.ts')

    expect(mockedGlob).toHaveBeenCalledWith('src/**/*.ts', { onlyFiles: false })
    expect(result?.isFile()).toBe(true)

    fsMock.mockRestore()
  })

  it('应正确处理空字符串输入', async () => {
    mockedGlob.mockResolvedValue(createListSource([]))

    const result = await stat('')

    expect(result).toBeNull()
    expect(mockedEcho).toHaveBeenCalledWith(
      'stat',
      expect.stringContaining('not found')
    )
  })

  it('应正确处理包含特殊字符的路径', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 64,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['测试文件 (1).txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('测试文件 (1).txt')

    expect(result?.isFile()).toBe(true)
    expect(result?.size).toBe(64)

    fsMock.mockRestore()
  })

  it('应处理 glob 模式边界条件', async () => {
    // 测试无匹配结果的 glob 模式
    mockedGlob.mockResolvedValue(createListSource([]))
    const result1 = await stat('*.nonexistent')
    expect(result1).toBeNull()

    // 测试单字符通配符
    mockedGlob.mockResolvedValue(createListSource(['a.txt']))
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 32,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result2 = await stat('?.txt')
    expect(result2?.isFile()).toBe(true)

    fsMock.mockRestore()
  })

  it('应处理文件与目录混合的 glob 匹配', async () => {
    const mockStats = {
      isFile: () => false,
      isDirectory: () => true,
      isSymbolicLink: () => false,
      size: 0,
      mtime: new Date(),
      mode: 0o755,
    } as fs.Stats

    mockedGlob.mockResolvedValue(createListSource(['mixdir']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(null, mockStats)
    })

    const result = await stat('mix*')
    expect(result?.isDirectory()).toBe(true)

    fsMock.mockRestore()
  })

  it('应正确处理权限错误场景', async () => {
    const permissionError = Object.assign(new Error('operation not permitted'), {
      code: 'EPERM',
      errno: -1,
      syscall: 'stat'
    })

    mockedGlob.mockResolvedValue(createListSource(['protected.txt']))
    const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
      const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
      cb(permissionError)
    })

    await expect(stat('protected.txt')).rejects.toThrow('operation not permitted')

    fsMock.mockRestore()
  })

  it('应处理并发场景下的状态查询', async () => {
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      size: 100,
      mtime: new Date(),
      mode: 0o644,
    } as fs.Stats

    // 模拟并发查询
    const promises = ['file1.txt', 'file2.txt', 'file3.txt'].map((filename) => {
      mockedGlob.mockResolvedValue(createListSource([filename]))
      const fsMock = vi.spyOn(fs, 'stat').mockImplementation((path, callback) => {
        const cb = callback as (err: NodeJS.ErrnoException | null, stats?: fs.Stats) => void
        // 模拟异步延迟
        setTimeout(() => cb(null, mockStats), Math.random() * 10)
      })

      const promise = stat(filename)
      promise.finally(() => fsMock.mockRestore())
      return promise
    })

    const results = await Promise.all(promises)

    for (const result of results) {
      expect(result?.isFile()).toBe(true)
      expect(result?.size).toBe(100)
    }
  })
})

describe('stat - 基础功能测试', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await fse.ensureDir(tempDir)
  })

  afterEach(async () => {
    await fse.remove(tempDir)
  })

  it('应能检测真实文件是否存在', async () => {
    const filePath = tempFile('simple.txt')

    // 测试文件不存在的情况
    const result1 = await stat(filePath)
    expect(result1).toBeNull()

    // 创建文件后再测试
    await fse.writeFile(filePath, 'test content')
    const result2 = await stat(filePath)
    expect(result2).not.toBeNull()
    expect(result2?.isFile()).toBe(true)
  })

  it('应能检测真实目录是否存在', async () => {
    const dirPath = tempFile('simple-dir')

    // 测试目录不存在的情况
    const result1 = await stat(dirPath)
    expect(result1).toBeNull()

    // 创建目录后再测试
    await fse.ensureDir(dirPath)
    const result2 = await stat(dirPath)
    expect(result2).not.toBeNull()
    expect(result2?.isDirectory()).toBe(true)
  })

  it('应能正确返回文件大小', async () => {
    const filePath = tempFile('sized.txt')
    const content = 'Hello World!'

    await fse.writeFile(filePath, content)
    const result = await stat(filePath)

    expect(result?.size).toBe(content.length)
  })

  it('应能处理空文件', async () => {
    const filePath = tempFile('empty.txt')

    await fse.writeFile(filePath, '')
    const result = await stat(filePath)

    expect(result?.isFile()).toBe(true)
    expect(result?.size).toBe(0)
  })

  it('应能处理特殊字符文件名', async () => {
    const filePath = tempFile('测试-文件@#$.txt')

    await fse.writeFile(filePath, 'content')
    const result = await stat(filePath)

    expect(result?.isFile()).toBe(true)
  })
})
