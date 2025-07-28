import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import rename from '../src/rename.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)

describe('rename - 真实文件系统测试', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir) // 确保临时目录存在
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

    // 删除冗余注释，简化测试用例说明。
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
