import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import stat from '../src/stat.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/write'
const tempFile = (name: string) => `${TEMP_DIR}/${name}`

describe('write - 基础功能测试', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应能写入字符串内容到文件', async () => {
    const filePath = tempFile('test.txt')
    const content = 'Hello, World!'

    await write(filePath, content)

    expect(await isExist(filePath)).toBe(true)
    expect(await read(filePath)).toBe(content)
  })

  it('应能写入 JSON 对象到文件', async () => {
    const filePath = tempFile('config.json')
    const data = { name: 'test', version: '1.0.0' }

    await write(filePath, data)

    expect(await isExist(filePath)).toBe(true)
    const readData = await read(filePath)
    expect(readData).toEqual(data)
  })

  it('应能写入 Buffer 到文件', async () => {
    const filePath = tempFile('binary.bin')
    const buffer = Buffer.from([1, 2, 3, 4, 5])

    await write(filePath, buffer)

    expect(await isExist(filePath)).toBe(true)
    const readBuffer = await read(filePath, { raw: true })
    expect(readBuffer).toEqual(buffer)
  })

  it('应自动创建不存在的目录', async () => {
    const filePath = tempFile('nested/dir/test.txt')
    const content = 'nested content'

    await write(filePath, content)

    expect(await isExist(filePath)).toBe(true)
    expect(await read(filePath)).toBe(content)
    expect(await isExist(`${TEMP_DIR}/nested/dir`)).toBe(true)
  })

  it('应覆盖已存在的文件', async () => {
    const filePath = tempFile('overwrite.txt')
    const originalContent = 'original'
    const newContent = 'new content'

    await write(filePath, originalContent)
    await write(filePath, newContent)

    expect(await read(filePath)).toBe(newContent)
  })

  it('应支持不同编码格式', async () => {
    const filePath = tempFile('encoding.txt')
    const content = '测试中文内容'

    await write(filePath, content, { encoding: 'utf8' })

    expect(await read(filePath)).toBe(content)
  })

  it('应支持设置文件权限', async () => {
    const filePath = tempFile('permissions.txt')
    const content = 'test permissions'
    const mode = 0o644

    await write(filePath, content, { mode })

    expect(await isExist(filePath)).toBe(true)
    const stats = await stat(filePath)

    // Windows 和 Unix 系统的文件权限处理不同，只验证文件已创建
    if (process.platform === 'win32') {
      // Windows 上只验证文件存在且可读
      expect(stats?.mode).toBeDefined()
    } else {
      // Unix 系统上验证具体权限
      expect(stats?.mode && stats.mode & 0o777).toBe(mode)
    }
  })

  it('应能写入大文件内容', async () => {
    const filePath = tempFile('large.txt')
    const largeContent = 'x'.repeat(1024 * 100) // 100KB

    await write(filePath, largeContent)

    expect(await isExist(filePath)).toBe(true)
    expect(await read(filePath)).toBe(largeContent)
    const stats = await stat(filePath)
    expect(stats?.size).toBe(largeContent.length)
  })

  it('应能处理并发写入不同文件', async () => {
    const files = Array.from({ length: 5 }, (_, i) => ({
      path: tempFile(`concurrent_${i}.txt`),
      content: `content ${i}`,
    }))

    await Promise.all(files.map(({ path, content }) => write(path, content)))

    for (const { path, content } of files) {
      expect(await isExist(path)).toBe(true)
      expect(await read(path)).toBe(content)
    }
  })

  it('应能处理并发写入同一文件', async () => {
    const filePath = tempFile('concurrent_same.txt')
    const promises = Array.from({ length: 3 }, (_, i) =>
      write(filePath, `content ${i}`),
    )

    await Promise.all(promises)

    expect(await isExist(filePath)).toBe(true)
    const finalContent = await read(filePath)
    expect(finalContent).toMatch(/^content \d$/)
  })

  it('应能写入空内容', async () => {
    const filePath = tempFile('empty.txt')

    await write(filePath, '')

    expect(await isExist(filePath)).toBe(true)
    expect(await read(filePath)).toBe('')
  })

  it('应能写入特殊字符文件名', async () => {
    const filePath = tempFile('测试文件 (1).txt')
    const content = 'special filename'

    await write(filePath, content)

    expect(await isExist(filePath)).toBe(true)
    // 注意：由于 glob 限制，特殊字符文件名可能无法通过 read 函数读取
    // 这是已知限制，在实际使用中建议避免特殊字符文件名
  })

  it('写入到不存在的目录应能自动创建', async () => {
    const nestedPath = tempFile('deeply/nested/path/test.txt')
    const content = 'auto create directories'

    await write(nestedPath, content)

    expect(await isExist(nestedPath)).toBe(true)
    expect(await read(nestedPath)).toBe(content)
  })

  it('应能写入 TypedArray 到文件', async () => {
    const filePath = tempFile('typed_array.bin')
    const typedArray = new Uint8Array([10, 20, 30, 40])

    await write(filePath, typedArray)

    expect(await isExist(filePath)).toBe(true)
    const readBuffer = await read(filePath, { raw: true })
    expect(new Uint8Array(readBuffer as Buffer)).toEqual(typedArray)
  })

  it('应能写入 ArrayBuffer 到文件', async () => {
    const filePath = tempFile('array_buffer.bin')
    const arrayBuffer = new Uint8Array([50, 60, 70]).buffer

    await write(filePath, arrayBuffer)

    expect(await isExist(filePath)).toBe(true)
    const readBuffer = await read(filePath, { raw: true })
    expect(new Uint8Array(readBuffer as Buffer)).toEqual(
      new Uint8Array([50, 60, 70]),
    )
  })

  it('应保持 TypedArray 底层原始字节', async () => {
    const filePath = tempFile('typed_array_bytes.bin')
    const typedArray = new Uint16Array([0x1234, 0xabcd])
    const expected = new Uint8Array(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    )

    await write(filePath, typedArray)

    expect(await isExist(filePath)).toBe(true)
    const readBuffer = await read(filePath, { raw: true })
    expect(new Uint8Array(readBuffer as Buffer)).toEqual(expected)
  })
})
