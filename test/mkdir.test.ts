import fse from 'fs-extra'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import mkdir from '../src/mkdir.js'

describe('mkdir 单元测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock echo for unit tests
    vi.mocked(echo).mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应正常创建单个目录', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockResolvedValue(undefined)

    await mkdir('testdir')

    expect(fseSpy).toHaveBeenCalledWith(expect.stringContaining('testdir'))
    expect(echo).toHaveBeenCalledWith('mkdir', expect.stringContaining('created'))

    fseSpy.mockRestore()
  })

  it('应正常创建多个目录', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockResolvedValue(undefined)

    await mkdir(['dir1', 'dir2'])

    expect(fseSpy).toHaveBeenCalledTimes(2)
    expect(fseSpy).toHaveBeenCalledWith(expect.stringContaining('dir1'))
    expect(fseSpy).toHaveBeenCalledWith(expect.stringContaining('dir2'))
    expect(echo).toHaveBeenCalledWith('mkdir', expect.stringContaining('created'))

    fseSpy.mockRestore()
  })

  it('应支持自定义并发数', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockResolvedValue(undefined)

    await mkdir(['dir1', 'dir2'], { concurrency: 2 })

    expect(fseSpy).toHaveBeenCalledTimes(2)
    expect(echo).toHaveBeenCalledWith('mkdir', expect.stringContaining('created'))

    fseSpy.mockRestore()
  })

  it('应过滤空路径', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockResolvedValue(undefined)

    await mkdir(['', 'valid'])

    expect(fseSpy).toHaveBeenCalledTimes(1)
    expect(fseSpy).toHaveBeenCalledWith(expect.stringContaining('valid'))

    fseSpy.mockRestore()
  })

  it('无有效路径时应直接返回', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockResolvedValue(undefined)

    await mkdir([])

    expect(fseSpy).not.toHaveBeenCalled()
    expect(echo).not.toHaveBeenCalled()

    fseSpy.mockRestore()
  })

  it('创建失败时应抛出错误', async () => {
    const fseSpy = vi.spyOn(fse, 'ensureDir').mockRejectedValue(new Error('mkdir error'))

    await expect(mkdir('faildir')).rejects.toThrow()

    fseSpy.mockRestore()
  })
})

// Mock echo module for unit tests
vi.mock('../src/echo.js')

// 集成测试 - 使用真实的模块
describe('mkdir 集成测试', () => {
  const tempDir = path.join(process.cwd(), 'temp')
  const testDir = path.join(tempDir, 'mkdir-test')

  beforeEach(async () => {
    await fse.ensureDir(tempDir)
    try {
      await fse.remove(testDir)
    } catch {}
  })

  afterEach(async () => {
    try {
      await fse.remove(testDir)
    } catch {}
  })

  it('应实际创建目录', async () => {
    await mkdir(testDir)
    expect(await fse.pathExists(testDir)).toBe(true)
    const stat = await fse.stat(testDir)
    expect(stat.isDirectory()).toBe(true)
  })

  it('应创建嵌套目录', async () => {
    const nestedDir = path.join(testDir, 'a', 'b', 'c')
    await mkdir(nestedDir)
    expect(await fse.pathExists(nestedDir)).toBe(true)
  })
})
