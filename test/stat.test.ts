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

  it('应能检测文件是否存在并返回状态', async () => {
    const filePath = tempFile('simple.txt')
    const result1 = await stat(filePath)
    expect(result1).toBeNull()

    await write(filePath, 'test content')
    const result2 = await stat(filePath)
    expect(result2).not.toBeNull()
    expect(result2?.isFile()).toBe(true)
  })

  it('应能检测目录是否存在', async () => {
    const dirPath = tempFile('simple-dir')
    await mkdir(dirPath)
    const result = await stat(dirPath)
    expect(result).not.toBeNull()
    expect(result?.isDirectory()).toBe(true)
  })
})
