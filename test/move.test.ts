import { promises as fs } from 'fs'
import path from 'path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import move from '../src/move.js'

const tempDir = path.join(process.cwd(), 'temp/move')
const fileA = path.join(tempDir, 'a.txt')
const fileB = path.join(tempDir, 'b.txt')
const dirTarget = path.join(tempDir, 'target')
const fileTarget = path.join(dirTarget, 'a.txt')

const cleanup = async () => {
  await fs.rm(tempDir, { recursive: true, force: true })
}

describe('move', () => {
  beforeEach(async () => {
    await cleanup()
    await fs.mkdir(tempDir, { recursive: true })
    await fs.writeFile(fileA, 'hello')
    await fs.writeFile(fileB, 'world')
    await fs.mkdir(dirTarget, { recursive: true })
  })

  afterEach(async () => {
    await cleanup()
  })

  it('应正常移动单个文件', async () => {
    await move(fileA, dirTarget)
    const exists = await fs.stat(fileTarget).then(
      () => true,
      () => false,
    )
    expect(exists).toBe(true)
    const srcExists = await fs.stat(fileA).then(
      () => true,
      () => false,
    )
    expect(srcExists).toBe(false)
  })

  it('应正常移动多个文件', async () => {
    await move([fileA, fileB], dirTarget)
    const existsA = await fs.stat(path.join(dirTarget, 'a.txt')).then(
      () => true,
      () => false,
    )
    const existsB = await fs.stat(path.join(dirTarget, 'b.txt')).then(
      () => true,
      () => false,
    )
    expect(existsA).toBe(true)
    expect(existsB).toBe(true)
    const srcExistsA = await fs.stat(fileA).then(
      () => true,
      () => false,
    )
    const srcExistsB = await fs.stat(fileB).then(
      () => true,
      () => false,
    )
    expect(srcExistsA).toBe(false)
    expect(srcExistsB).toBe(false)
  })

  it('应支持目标路径为函数', async () => {
    const calledNames: string[] = []
    const targetFn = (name: string) => {
      calledNames.push(name)
      return path.join(dirTarget, `backup_${path.basename(name)}`)
    }
    await move(fileA, targetFn)
    // 检查目标目录下是否有新文件且内容为 'hello'
    const files = await fs.readdir(dirTarget)
    let found = false
    for (const f of files) {
      if (f.startsWith('backup_')) {
        const fullPath = path.join(dirTarget, f)
        const stat = await fs.stat(fullPath)
        if (stat.isFile()) {
          const content = await fs.readFile(fullPath, 'utf8')
          if (content === 'hello') found = true
        } else if (stat.isDirectory()) {
          // 查找目录下的 a.txt
          const subFiles = await fs.readdir(fullPath)
          for (const sub of subFiles) {
            if (sub === 'a.txt') {
              const content = await fs.readFile(
                path.join(fullPath, sub),
                'utf8',
              )
              if (content === 'hello') found = true
            }
          }
        }
      }
    }
    expect(found).toBe(true)
    // 检查原文件已删除
    const srcExists = await fs.stat(fileA).then(
      () => true,
      () => false,
    )
    expect(srcExists).toBe(false)
    // 至少调用过一次 targetFn
    expect(calledNames.length).toBeGreaterThan(0)
  })

  it('应支持自定义并发数', async () => {
    await move([fileA, fileB], dirTarget, { concurrency: 1 })
    const existsA = await fs.stat(path.join(dirTarget, 'a.txt')).then(
      () => true,
      () => false,
    )
    const existsB = await fs.stat(path.join(dirTarget, 'b.txt')).then(
      () => true,
      () => false,
    )
    expect(existsA).toBe(true)
    expect(existsB).toBe(true)
  })

  it('copy 失败时应抛出错误', async () => {
    // 通过只读目录制造 copy 失败
    await fs.chmod(dirTarget, 0o400)
    await expect(move(fileA, dirTarget)).rejects.toThrow()
    await fs.chmod(dirTarget, 0o700)
  })
})
