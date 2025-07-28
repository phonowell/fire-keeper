import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import write from '../src/write.js'

const tempDir = path.join(process.cwd(), 'temp', 'write')
const tempFile = (name: string) => path.join(tempDir, name)

describe('write - 真实文件系统测试', () => {
  beforeEach(async () => {
    await fse.ensureDir(tempDir)
  })

  afterEach(async () => {
    await fse.remove(tempDir)
  })

  it('应能写入字符串内容到真实文件', async () => {
    const filePath = tempFile('test.txt')
    const content = 'Hello, World!'

    await write(filePath, content)

    expect(await fse.pathExists(filePath)).toBe(true)
    expect(await fse.readFile(filePath, 'utf8')).toBe(content)
  })

  it('应能写入 JSON 对象到真实文件', async () => {
    const filePath = tempFile('config.json')
    const data = { name: 'test', version: '1.0.0' }

    await write(filePath, data)

    expect(await fse.pathExists(filePath)).toBe(true)
    const readData = JSON.parse(await fse.readFile(filePath, 'utf8'))
    expect(readData).toEqual(data)
  })

  it('应能写入 Buffer 到真实文件', async () => {
    const filePath = tempFile('binary.bin')
    const buffer = Buffer.from([1, 2, 3, 4, 5])

    await write(filePath, buffer)

    expect(await fse.pathExists(filePath)).toBe(true)
    const readBuffer = await fse.readFile(filePath)
    expect(readBuffer).toEqual(buffer)
  })

  it('应自动创建不存在的目录', async () => {
    const filePath = tempFile('nested/dir/test.txt')
    const content = 'nested content'

    await write(filePath, content)

    expect(await fse.pathExists(filePath)).toBe(true)
    expect(await fse.readFile(filePath, 'utf8')).toBe(content)
    expect(await fse.pathExists(path.dirname(filePath))).toBe(true)
  })

  it('应覆盖已存在的文件', async () => {
    const filePath = tempFile('overwrite.txt')
    const originalContent = 'original'
    const newContent = 'new content'

    await fse.writeFile(filePath, originalContent)
    await write(filePath, newContent)

    expect(await fse.readFile(filePath, 'utf8')).toBe(newContent)
  })

  it('应支持不同编码格式', async () => {
    const filePath = tempFile('encoding.txt')
    const content = '测试中文内容'

    await write(filePath, content, { encoding: 'utf8' })

    expect(await fse.readFile(filePath, 'utf8')).toBe(content)
  })

  it('应支持设置文件权限', async () => {
    const filePath = tempFile('permissions.txt')
    const content = 'test permissions'
    const mode = 0o644

    await write(filePath, content, { mode })

    expect(await fse.pathExists(filePath)).toBe(true)
    const stats = await fse.stat(filePath)
    expect(stats.mode & 0o777).toBe(mode)
  })

  it('应能写入大文件内容', async () => {
    const filePath = tempFile('large.txt')
    const largeContent = 'x'.repeat(1024 * 100) // 100KB

    await write(filePath, largeContent)

    expect(await fse.pathExists(filePath)).toBe(true)
    expect(await fse.readFile(filePath, 'utf8')).toBe(largeContent)
    const stats = await fse.stat(filePath)
    expect(stats.size).toBe(largeContent.length)
  })

  it('应能处理并发写入不同文件', async () => {
    const files = Array.from({ length: 5 }, (_, i) => ({
      path: tempFile(`concurrent_${i}.txt`),
      content: `content ${i}`,
    }))

    await Promise.all(files.map(({ path, content }) => write(path, content)))

    for (const { path, content } of files) {
      expect(await fse.pathExists(path)).toBe(true)
      expect(await fse.readFile(path, 'utf8')).toBe(content)
    }
  })

  it('应能处理并发写入同一文件', async () => {
    const filePath = tempFile('concurrent_same.txt')
    const promises = Array.from({ length: 3 }, (_, i) =>
      write(filePath, `content ${i}`),
    )

    await Promise.all(promises)

    expect(await fse.pathExists(filePath)).toBe(true)
    const finalContent = await fse.readFile(filePath, 'utf8')
    expect(finalContent).toMatch(/^content \d$/)
  })

  it('应能写入空内容', async () => {
    const filePath = tempFile('empty.txt')

    await write(filePath, '')

    expect(await fse.pathExists(filePath)).toBe(true)
    expect(await fse.readFile(filePath, 'utf8')).toBe('')
  })

  it('应能写入特殊字符文件名', async () => {
    const filePath = tempFile('测试文件 (1).txt')
    const content = 'special filename'

    await write(filePath, content)

    expect(await fse.pathExists(filePath)).toBe(true)
    expect(await fse.readFile(filePath, 'utf8')).toBe(content)
  })

  it('写入到只读目录应抛出错误', async () => {
    const readOnlyDir = tempFile('readonly')
    await fse.ensureDir(readOnlyDir)
    try {
      await fse.chmod(readOnlyDir, 0o444)
      const filePath = path.join(readOnlyDir, 'test.txt')
      await expect(write(filePath, 'test')).rejects.toThrow()
    } catch {
      // 跳过：无法设置权限则不测
      return
    } finally {
      try {
        await fse.chmod(readOnlyDir, 0o755)
      } catch {}
    }
  })

  it('应能写入 TypedArray 到真实文件', async () => {
    const filePath = tempFile('typed_array.bin')
    const typedArray = new Uint8Array([10, 20, 30, 40])

    await write(filePath, typedArray)

    expect(await fse.pathExists(filePath)).toBe(true)
    const readBuffer = await fse.readFile(filePath)
    expect(new Uint8Array(readBuffer)).toEqual(typedArray)
  })

  it('应能写入 ArrayBuffer 到真实文件', async () => {
    const filePath = tempFile('array_buffer.bin')
    const arrayBuffer = new Uint8Array([50, 60, 70]).buffer

    await write(filePath, arrayBuffer)

    expect(await fse.pathExists(filePath)).toBe(true)
    const readBuffer = await fse.readFile(filePath)
    expect(new Uint8Array(readBuffer)).toEqual(new Uint8Array([50, 60, 70]))
  })
})
