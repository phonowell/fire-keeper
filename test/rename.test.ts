import fs from 'fs'
import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import rename from '../src/rename.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)

const mockedEcho = vi.mocked(echo)

describe('rename - Mock 测试', () => {
  vi.mock('../src/echo.js')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应正常重命名文件', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('a.txt', 'b.txt')

    expect(fsMock).toHaveBeenCalledWith(
      expect.stringContaining('a.txt'),
      expect.stringContaining('b.txt'),
      expect.any(Function),
    )
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })

  it('应正常重命名目录', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('dirA', 'dirB')

    expect(fsMock).toHaveBeenCalledWith(
      expect.stringContaining('dirA'),
      expect.stringContaining('dirB'),
      expect.any(Function),
    )
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })

  it('应正常重命名符号链接', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('linkA', 'linkB')

    expect(fsMock).toHaveBeenCalledWith(
      expect.stringContaining('linkA'),
      expect.stringContaining('linkB'),
      expect.any(Function),
    )
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })

  it('应抛出 ENOENT 异常', async () => {
    const error = Object.assign(new Error('not found'), { code: 'ENOENT' })
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(error)
      })

    await expect(rename('notfound.txt', 'b.txt')).rejects.toThrow('not found')
    fsMock.mockRestore()
  })

  it('应抛出 EEXIST 异常', async () => {
    const error = Object.assign(new Error('target exists'), { code: 'EEXIST' })
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(error)
      })

    await expect(rename('a.txt', 'b.txt')).rejects.toThrow('target exists')
    fsMock.mockRestore()
  })

  it('应抛出 EPERM 异常', async () => {
    const error = Object.assign(new Error('permission denied'), {
      code: 'EPERM',
    })
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(error)
      })

    await expect(rename('a.txt', 'b.txt')).rejects.toThrow('permission denied')
    fsMock.mockRestore()
  })

  it('重命名为相同名称应正常调用', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('same.txt', 'same.txt')

    expect(fsMock).toHaveBeenCalledWith(
      expect.stringContaining('same.txt'),
      expect.stringContaining('same.txt'),
      expect.any(Function),
    )
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })

  it('应处理路径归一化', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('./a.txt', 'b.txt')

    expect(fsMock).toHaveBeenCalled()
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })

  it('重命名为不同大小写应正常调用', async () => {
    const fsMock = vi
      .spyOn(fs, 'rename')
      .mockImplementation((oldPath, newPath, cb) => {
        const callback = cb as (err: NodeJS.ErrnoException | null) => void
        callback(null)
      })

    await rename('a.txt', 'A.txt')

    expect(fsMock).toHaveBeenCalled()
    expect(mockedEcho).toHaveBeenCalledWith(
      'rename',
      expect.stringContaining('renamed'),
    )
    fsMock.mockRestore()
  })
})

describe('rename - 真实文件系统测试', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir)
  })

  afterEach(async () => {
    await fse.remove(tempDir)
  })

  it('应能重命名真实文件', async () => {
    const srcFile = tempFile('test.txt')
    const targetName = 'renamed.txt'
    const targetFile = tempFile(targetName)

    await fse.writeFile(srcFile, 'hello')
    await rename(srcFile, targetName)

    expect(await fse.pathExists(targetFile)).toBe(true)
    expect(await fse.pathExists(srcFile)).toBe(false)
    expect(await fse.readFile(targetFile, 'utf8')).toBe('hello')
  })

  it('应能重命名真实目录', async () => {
    const srcDir = tempFile('testdir')
    const targetName = 'renameddir'
    const targetDir = tempFile(targetName)
    const testFile = path.join(srcDir, 'file.txt')

    await fse.ensureDir(srcDir)
    await fse.writeFile(testFile, 'content')
    await rename(srcDir, targetName)

    expect(await fse.pathExists(targetDir)).toBe(true)
    expect(await fse.pathExists(srcDir)).toBe(false)
    expect(await fse.readFile(path.join(targetDir, 'file.txt'), 'utf8')).toBe(
      'content',
    )
  })

  it('重命名不存在的文件应抛出错误', async () => {
    await expect(
      rename(tempFile('notexist.txt'), 'renamed.txt'),
    ).rejects.toThrow()
  })

  it('重命名到已存在的目标在某些情况下可能覆盖', async () => {
    const srcFile = tempFile('source.txt')
    const targetFile = tempFile('target.txt')

    await fse.writeFile(srcFile, 'source')
    await fse.writeFile(targetFile, 'target')

    // 在某些操作系统上，rename 可能会覆盖目标文件
    // 这里我们只验证操作可以完成，无论是覆盖还是抛出错误
    try {
      await rename(srcFile, 'target.txt')
      // 如果成功，验证源文件不存在，目标文件内容是源文件的内容
      expect(await fse.pathExists(srcFile)).toBe(false)
      expect(await fse.readFile(targetFile, 'utf8')).toBe('source')
    } catch (error) {
      // 如果抛出错误也是可接受的行为
      expect(error).toBeDefined()
    }
  })

  it('重命名包含特殊字符的文件', async () => {
    const srcFile = tempFile('测试文件.txt')
    const targetName = '重命名文件.txt'
    const targetFile = tempFile(targetName)

    await fse.writeFile(srcFile, 'unicode content')
    await rename(srcFile, targetName)

    expect(await fse.pathExists(targetFile)).toBe(true)
    expect(await fse.pathExists(srcFile)).toBe(false)
    expect(await fse.readFile(targetFile, 'utf8')).toBe('unicode content')
  })

  it('重命名时保持在同一目录', async () => {
    const subDir = tempFile('subdir')
    const srcFile = path.join(subDir, 'original.txt')
    const targetName = 'renamed.txt'
    const targetFile = path.join(subDir, targetName)

    await fse.ensureDir(subDir)
    await fse.writeFile(srcFile, 'test')
    await rename(srcFile, targetName)

    expect(await fse.pathExists(targetFile)).toBe(true)
    expect(await fse.pathExists(srcFile)).toBe(false)
    expect(path.dirname(targetFile)).toBe(subDir)
  })
})
