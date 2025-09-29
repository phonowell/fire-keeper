import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import stat from '../src/stat.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/stat'
const tempFile = (name: string) => `${TEMP_DIR}/${name}`

describe('stat - 基础功能测试', () => {
  beforeEach(async () => {
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应能检测真实文件是否存在', async () => {
    const filePath = tempFile('simple.txt')
    const result1 = await stat(filePath)
    expect(result1).toBeNull()

    await write(filePath, 'test content')
    const result2 = await stat(filePath)
    expect(result2).not.toBeNull()
    expect(result2?.isFile()).toBe(true)
  })

  it('应能检测真实目录是否存在', async () => {
    const dirPath = tempFile('simple-dir')
    const result1 = await stat(dirPath)
    expect(result1).toBeNull()

    await mkdir(dirPath)
    const result2 = await stat(dirPath)
    expect(result2).not.toBeNull()
    expect(result2?.isDirectory()).toBe(true)
  })

  it('应能正确返回文件大小', async () => {
    const filePath = tempFile('sized.txt')
    const content = 'Hello World!'
    await write(filePath, content)
    const result = await stat(filePath)
    expect(result?.size).toBe(content.length)
  })

  it('应能处理空文件', async () => {
    const filePath = tempFile('empty.txt')
    await write(filePath, '')
    const result = await stat(filePath)
    expect(result?.isFile()).toBe(true)
    expect(result?.size).toBe(0)
  })

  it('应能处理特殊字符文件名', async () => {
    const filePath = tempFile('测试-文件@#$.txt')
    await write(filePath, 'content')
    const result = await stat(filePath)
    expect(result?.isFile()).toBe(true)
  })

  it('应能正确处理不存在的路径', async () => {
    const filePath = tempFile('not-exist.txt')
    const result = await stat(filePath)
    expect(result).toBeNull()
  })
})
