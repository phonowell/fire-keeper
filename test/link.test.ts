import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import link from '../src/link.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/link'

const tempFile = (name: string) => `${TEMP_DIR}/${name}`

describe('link', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应能创建文件符号链接', async () => {
    const src = tempFile('src-file.txt')
    const dest = tempFile('dest-link.txt')
    await write(src, 'hello')
    await link(src, dest)

    // 检查符号链接是否创建成功
    expect(await isExist(dest)).toBe(true)

    // 检查通过符号链接读取的内容是否正确
    const linked = await read(dest)
    expect(linked).toBe('hello')
  })

  it('应能创建目录符号链接', async () => {
    const srcDir = tempFile('src-dir')
    const destDir = tempFile('dest-dir-link')
    await mkdir(srcDir)
    await write(`${srcDir}/a.txt`, 'abc')
    await link(srcDir, destDir)

    // 检查目录符号链接是否创建成功
    expect(await isExist(destDir)).toBe(true)

    // 检查可以通过符号链接访问目录内容
    expect(await isExist(`${destDir}/a.txt`)).toBe(true)

    // 检查文件内容是否正确
    const content = await read(`${destDir}/a.txt`)
    expect(content).toBe('abc')
  })
})
