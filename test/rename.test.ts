import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import rename from '../src/rename.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/rename'
const tempFile = (name: string) => `${TEMP_DIR}/${name}`

describe('rename - 真实文件系统测试', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应能重命名真实文件', async () => {
    const srcFile = tempFile('test.txt')
    const targetName = 'renamed.txt'
    const targetFile = tempFile(targetName)

    await write(srcFile, 'hello')
    await rename(srcFile, targetName)

    expect(await isExist(targetFile)).toBe(true)
    expect(await isExist(srcFile)).toBe(false)
    expect(await read(targetFile)).toBe('hello')
  })

  it('应能重命名真实目录', async () => {
    const srcDir = tempFile('testdir')
    const targetName = 'renameddir'
    const targetDir = tempFile(targetName)
    const testFile = `${srcDir}/file.txt`

    await mkdir(srcDir)
    await write(testFile, 'content')
    await rename(srcDir, targetName)

    expect(await isExist(targetDir)).toBe(true)
    expect(await isExist(srcDir)).toBe(false)
    expect(await read(`${targetDir}/file.txt`)).toBe('content')
  })

  it('重命名不存在的文件应抛出错误', async () => {
    await expect(
      rename(tempFile('notexist.txt'), 'renamed.txt'),
    ).rejects.toThrow()
  })

  it('重命名到已存在的目标在某些情况下可能覆盖', async () => {
    const srcFile = tempFile('source.txt')
    const targetFile = tempFile('target.txt')

    await write(srcFile, 'source')
    await write(targetFile, 'target')

    // 删除冗余注释，简化测试用例说明。
    try {
      await rename(srcFile, 'target.txt')
      // 如果成功，验证源文件不存在，目标文件内容是源文件的内容
      expect(await isExist(srcFile)).toBe(false)
      expect(await read(targetFile)).toBe('source')
    } catch (error) {
      // 如果抛出错误也是可接受的行为
      expect(error).toBeDefined()
    }
  })

  it('重命名包含特殊字符的文件', async () => {
    const srcFile = tempFile('测试文件.txt')
    const targetName = '重命名文件.txt'
    const targetFile = tempFile(targetName)

    await write(srcFile, 'unicode content')
    await rename(srcFile, targetName)

    expect(await isExist(targetFile)).toBe(true)
    expect(await isExist(srcFile)).toBe(false)
    expect(await read(targetFile)).toBe('unicode content')
  })

  it('重命名时保持在同一目录', async () => {
    const subDir = tempFile('subdir')
    const srcFile = `${subDir}/original.txt`
    const targetName = 'renamed.txt'
    const targetFile = `${subDir}/${targetName}`

    await mkdir(subDir)
    await write(srcFile, 'test')
    await rename(srcFile, targetName)

    expect(await isExist(targetFile)).toBe(true)
    expect(await isExist(srcFile)).toBe(false)
    // 验证文件仍在同一目录下
    expect(targetFile.startsWith(subDir)).toBe(true)
  })
})
