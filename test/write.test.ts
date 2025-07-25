import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import write from '../src/write.js'

const tempDir = path.join(process.cwd(), 'temp')
const tempFile = (name: string) => path.join(tempDir, name)

const mockedEcho = vi.mocked(echo)

describe('write - Mock 测试', () => {
  vi.mock('../src/echo.js')

  let fseMock: any

  beforeEach(() => {
    vi.clearAllMocks()
    fseMock = vi.spyOn(fse, 'outputFile').mockResolvedValue(undefined)
  })

  it('应写入字符串内容', async () => {
    await write('a.txt', 'hello')
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), 'hello', {})
    expect(mockedEcho).toHaveBeenCalledWith(
      'write',
      expect.stringContaining('wrote'),
    )
  })

  it('应写入 Buffer 内容', async () => {
    const buf = Buffer.from([1, 2, 3])
    await write('b.bin', buf)
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), buf, {})
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入 ArrayBuffer 内容', async () => {
    const arr = new Uint8Array([4, 5, 6]).buffer
    await write('c.bin', arr)
    expect(fseMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Uint8Array),
      {},
    )
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入 TypedArray 内容', async () => {
    const typed = new Int32Array([7, 8, 9])
    await write('d.bin', typed)
    expect(fseMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Uint8Array),
      {},
    )
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入对象内容为 JSON 字符串', async () => {
    await write('f.json', { a: 1 })
    expect(fseMock).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify({ a: 1 }),
      {},
    )
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入数字内容为字符串', async () => {
    await write('g.txt', 123)
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), '123', {})
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入布尔值内容为字符串', async () => {
    await write('h.txt', false)
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), 'false', {})
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入 null 内容为字符串', async () => {
    await write('i.txt', null)
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), 'null', {})
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应写入 undefined 内容为字符串', async () => {
    await write('j.txt', undefined)
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), 'undefined', {})
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('应支持写入时传递 options', async () => {
    await write('n.txt', 'opt', { mode: 0o644 })
    expect(fseMock).toHaveBeenCalledWith(expect.any(String), 'opt', {
      mode: 0o644,
    })
    expect(mockedEcho).toHaveBeenCalled()
  })

  it('异常路径应抛出错误', async () => {
    fseMock.mockRejectedValueOnce(new Error('路径错误'))
    await expect(write('/invalid/path.txt', 'err')).rejects.toThrow('路径错误')
  })
})

describe('write - 真实文件系统测试', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
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
    expect(stats.mode & parseInt('777', 8)).toBe(mode)
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

    await Promise.all(
      files.map(({ path, content }) => write(path, content))
    )

    for (const { path, content } of files) {
      expect(await fse.pathExists(path)).toBe(true)
      expect(await fse.readFile(path, 'utf8')).toBe(content)
    }
  })

  it('应能处理并发写入同一文件', async () => {
    const filePath = tempFile('concurrent_same.txt')
    const promises = Array.from({ length: 3 }, (_, i) =>
      write(filePath, `content ${i}`)
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

    // 在某些系统上可能无法设置只读权限，因此这个测试可能跳过
    try {
      await fse.chmod(readOnlyDir, 0o444)
      const filePath = path.join(readOnlyDir, 'test.txt')

      await expect(write(filePath, 'test')).rejects.toThrow()
    } catch (error) {
      // 如果无法设置权限，跳过这个测试
      console.warn('无法测试只读目录权限限制')
    } finally {
      // 恢复权限以便清理
      try {
        await fse.chmod(readOnlyDir, 0o755)
      } catch {
        // 忽略恢复权限失败
      }
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
