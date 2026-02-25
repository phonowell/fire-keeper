import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import clean from '../src/clean.js'
import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/clean'

describe('clean', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应删除单个文件及空父目录', async () => {
    const file = `${TEMP_DIR}/a.txt`
    await write(file, 'test')
    await clean(file)
    expect(await isExist(file)).toBe(false)
    // 用 clean 清理后，目录可能已被删除
    expect(await isExist(TEMP_DIR)).toBe(false)
  })

  it('父目录不空时不删除目录', async () => {
    const file1 = `${TEMP_DIR}/a.txt`
    const file2 = `${TEMP_DIR}/b.txt`
    await write(file1, '1')
    await write(file2, '2')
    await clean(file1)
    expect(await isExist(file1)).toBe(false)
    expect(await isExist(file2)).toBe(true)
    expect(await isExist(TEMP_DIR)).toBe(true)
  })

  it('支持数组参数，全部删除且父目录为空则删除目录', async () => {
    const file1 = `${TEMP_DIR}/a.txt`
    const file2 = `${TEMP_DIR}/b.txt`
    await write(file1, '1')
    await write(file2, '2')
    await clean([file1, file2])
    expect(await isExist(file1)).toBe(false)
    expect(await isExist(file2)).toBe(false)
    expect(await isExist(TEMP_DIR)).toBe(false)
  })

  it('多个父目录均为空时应全部删除', async () => {
    const dir1 = `${TEMP_DIR}/a`
    const dir2 = `${TEMP_DIR}/b`
    const file1 = `${dir1}/a.txt`
    const file2 = `${dir2}/b.txt`

    await write(file1, '1')
    await write(file2, '2')

    await clean([file1, file2])

    expect(await isExist(dir1)).toBe(false)
    expect(await isExist(dir2)).toBe(false)
  })

  it('无匹配文件时应无异常且目录不变', async () => {
    await clean(`${TEMP_DIR}/notfound.txt`)
    expect(await isExist(TEMP_DIR)).toBe(true)
  })

  it('异常时应抛出错误', async () => {
    // 传入非法路径，glob会报错
    await expect(clean('\0')).rejects.toThrow()
  })
})
