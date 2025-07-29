import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

describe('read', () => {
  const TEMP_DIR = './temp/read'
  const txtFile = `${TEMP_DIR}/test.txt`
  const jsonFile = `${TEMP_DIR}/test.json`
  const yamlFile = `${TEMP_DIR}/test.yaml`
  const binFile = `${TEMP_DIR}/test.bin`
  const notExistFile = `${TEMP_DIR}/not-exist.txt`

  beforeAll(async () => {
    await mkdir(TEMP_DIR)
    await write(txtFile, 'hello world')
    await write(jsonFile, JSON.stringify({ foo: 'bar' }))
    await write(yamlFile, 'foo: bar')
    await write(binFile, Buffer.from([1, 2, 3, 4]))
  })

  afterAll(async () => {
    try {
      await remove(TEMP_DIR)
    } catch {}
  })

  it('应读取文本文件为字符串', async () => {
    const result = await read(txtFile)
    expect(result).toBe('hello world')
    expect(typeof result).toBe('string')
  })

  it('应读取 JSON 文件为对象', async () => {
    const result = await read(jsonFile)
    expect(result).toEqual({ foo: 'bar' })
    expect(typeof result).toBe('object')
  })

  it('应读取 YAML 文件为对象', async () => {
    const result = await read(yamlFile)
    expect(result).toEqual({ foo: 'bar' })
    expect(typeof result).toBe('object')
  })

  it('应读取二进制文件为 Buffer', async () => {
    const result = await read(binFile)
    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result).toEqual(Buffer.from([1, 2, 3, 4]))
  })

  it('raw 选项应返回 Buffer', async () => {
    const result = await read(txtFile, { raw: true })
    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result?.toString()).toBe('hello world')
  })

  it('文件不存在应返回 undefined', async () => {
    const result = await read(notExistFile)
    expect(result).toBeUndefined()
  })

  it('应支持 glob 模式匹配', async () => {
    const glob1 = `${TEMP_DIR}/glob1.txt`
    const glob2 = `${TEMP_DIR}/glob2.txt`

    await write(glob1, 'glob1')
    await write(glob2, 'glob2')

    const result = await read(`${TEMP_DIR}/glob*.txt`)
    // read 只返回第一个匹配文件内容，需判断类型
    if (typeof result === 'string') expect(['glob1', 'glob2']).toContain(result)
    else throw new Error('glob 匹配应返回字符串')

    await remove(glob1)
    await remove(glob2)
  })
})
