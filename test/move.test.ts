import { promises as fs } from 'fs'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import move from '../src/move.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/move'
const fileA = `${TEMP_DIR}/a.txt`
const fileB = `${TEMP_DIR}/b.txt`
const dirTarget = `${TEMP_DIR}/target`
const fileTarget = `${dirTarget}/a.txt`

const cleanup = async () => {
  await remove(TEMP_DIR)
}

describe('move', () => {
  beforeEach(async () => {
    await cleanup()
    await mkdir(TEMP_DIR)
    await write(fileA, 'hello')
    await write(fileB, 'world')
    await mkdir(dirTarget)
  })

  afterEach(async () => {
    await cleanup()
  })

  it('应正常移动单个文件', async () => {
    await move(fileA, dirTarget)
    expect(await isExist(fileTarget)).toBe(true)
    expect(await isExist(fileA)).toBe(false)
  })

  it('应正常移动多个文件', async () => {
    await move([fileA, fileB], dirTarget)
    expect(await isExist(`${dirTarget}/a.txt`)).toBe(true)
    expect(await isExist(`${dirTarget}/b.txt`)).toBe(true)
    expect(await isExist(fileA)).toBe(false)
    expect(await isExist(fileB)).toBe(false)
  })

  it('应支持目标路径为函数', async () => {
    const calledNames: string[] = []
    const targetFn = (dirname: string) => {
      calledNames.push(dirname)
      return `${dirTarget}/backup_dir`
    }
    await move(fileA, targetFn)

    // 检查目标文件是否存在且内容正确
    const targetFile = `${dirTarget}/backup_dir/a.txt`
    expect(await isExist(targetFile)).toBe(true)
    expect(await read(targetFile)).toBe('hello')

    // 检查原文件已删除
    expect(await isExist(fileA)).toBe(false)

    // 至少调用过一次 targetFn
    expect(calledNames.length).toBeGreaterThan(0)
  })

  it('应支持自定义并发数', async () => {
    await move([fileA, fileB], dirTarget, { concurrency: 1 })
    expect(await isExist(`${dirTarget}/a.txt`)).toBe(true)
    expect(await isExist(`${dirTarget}/b.txt`)).toBe(true)
  })

  it('copy 失败时应抛出错误', async () => {
    // 通过只读目录制造 copy 失败
    await fs.chmod(dirTarget, 0o400)
    await expect(move(fileA, dirTarget)).rejects.toThrow()
    await fs.chmod(dirTarget, 0o700)
  })
})
