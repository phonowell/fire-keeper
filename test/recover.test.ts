import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import clean from '../src/clean.js'
import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import recover from '../src/recover.js'
import write from '../src/write.js'

const TEMP_DIR = './temp'

beforeEach(async () => {
  await mkdir(TEMP_DIR)
  await clean(TEMP_DIR)
})

afterEach(async () => {
  await clean(TEMP_DIR)
})

describe('recover', () => {
  it('应正常恢复单个文件', async () => {
    const file = `${TEMP_DIR}/a.txt`
    const bak = `${file}.bak`
    await write(bak, 'backup')
    await recover(file)
    const content = await read(file)
    expect(content).toBe('backup')
    expect(await isExist(bak)).toBe(false)
  })

  it('应正常恢复多个文件', async () => {
    const file1 = `${TEMP_DIR}/b1.txt`
    const file2 = `${TEMP_DIR}/b2.txt`
    const bak1 = `${file1}.bak`
    const bak2 = `${file2}.bak`
    await write(bak1, 'b1')
    await write(bak2, 'b2')
    await recover([file1, file2])
    expect(await read(file1)).toBe('b1')
    expect(await read(file2)).toBe('b2')
    expect(await isExist(bak1)).toBe(false)
    expect(await isExist(bak2)).toBe(false)
  })

  it('应支持自定义并发数', async () => {
    const file = `${TEMP_DIR}/c.txt`
    const bak = `${file}.bak`
    await write(bak, 'concurrent')
    await recover(file, { concurrency: 2 })
    expect(await read(file)).toBe('concurrent')
  })

  it('无备份文件时应无操作', async () => {
    const file = `${TEMP_DIR}/d.txt`
    await expect(recover(file)).resolves.toBeUndefined()
    expect(await isExist(file)).toBe(false)
  })

  it('应正确处理空内容的备份文件', async () => {
    const file = `${TEMP_DIR}/e.txt`
    const bak = `${file}.bak`
    await write(bak, '')
    await recover(file)
    expect(await read(file)).toBe('')
  })
})
