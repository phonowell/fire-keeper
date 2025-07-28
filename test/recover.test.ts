import { promises as fs } from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import read from '../src/read.js'
import recover from '../src/recover.js'
import write from '../src/write.js'

const tempDir = path.join(process.cwd(), 'temp')

const cleanupTemp = async () => {
  try {
    const files = await fs.readdir(tempDir)
    await Promise.all(
      files.map((file) => fs.rm(path.join(tempDir, file), { force: true })),
    )
  } catch {}
}

beforeEach(async () => {
  await fs.mkdir(tempDir, { recursive: true })
  await cleanupTemp()
})

afterEach(async () => {
  await cleanupTemp()
})

describe('recover', () => {
  it('应正常恢复单个文件', async () => {
    const file = path.join(tempDir, 'a.txt')
    const bak = `${file}.bak`
    await write(bak, 'backup')
    await recover(file)
    const content = await read(file)
    expect(content).toBe('backup')
    const bakExist = await fs
      .access(bak)
      .then(() => true)
      .catch(() => false)
    expect(bakExist).toBe(false)
  })

  it('应正常恢复多个文件', async () => {
    const file1 = path.join(tempDir, 'b1.txt')
    const file2 = path.join(tempDir, 'b2.txt')
    const bak1 = `${file1}.bak`
    const bak2 = `${file2}.bak`
    await write(bak1, 'b1')
    await write(bak2, 'b2')
    await recover([file1, file2])
    expect(await read(file1)).toBe('b1')
    expect(await read(file2)).toBe('b2')
    const bak1Exist = await fs
      .access(bak1)
      .then(() => true)
      .catch(() => false)
    const bak2Exist = await fs
      .access(bak2)
      .then(() => true)
      .catch(() => false)
    expect(bak1Exist).toBe(false)
    expect(bak2Exist).toBe(false)
  })

  it('应支持自定义并发数', async () => {
    const file = path.join(tempDir, 'c.txt')
    const bak = `${file}.bak`
    await write(bak, 'concurrent')
    await recover(file, { concurrency: 2 })
    expect(await read(file)).toBe('concurrent')
  })

  it('无备份文件时应无操作', async () => {
    const file = path.join(tempDir, 'd.txt')
    await expect(recover(file)).resolves.toBeUndefined()
    const exist = await fs
      .access(file)
      .then(() => true)
      .catch(() => false)
    expect(exist).toBe(false)
  })

  it('应正确处理空内容的备份文件', async () => {
    const file = path.join(tempDir, 'e.txt')
    const bak = `${file}.bak`
    await write(bak, '')
    await recover(file)
    expect(await read(file)).toBe('')
  })
})
