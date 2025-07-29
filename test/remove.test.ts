import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/remove'

const tempFile = (name: string) => `${TEMP_DIR}/${name}`

describe('remove', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })
  afterEach(async () => {
    await remove(TEMP_DIR)
  })

  it('应删除单个文件', async () => {
    const file = tempFile('a.txt')
    await write(file, 'hello')
    expect(await isExist(file)).toBe(true)
    await remove(file)
    expect(await isExist(file)).toBe(false)
  })

  it('应删除多个文件', async () => {
    const files = ['b.txt', 'c.txt'].map(tempFile)
    await Promise.all(files.map((f) => write(f, 'x')))
    for (const f of files) expect(await isExist(f)).toBe(true)
    await remove(files)
    for (const f of files) expect(await isExist(f)).toBe(false)
  })

  it('应删除目录', async () => {
    const dir = tempFile('dir')
    await mkdir(dir)
    await write(`${dir}/d.txt`, 'y')
    expect(await isExist(dir)).toBe(true)
    await remove(dir)
    expect(await isExist(dir)).toBe(false)
  })

  it('应支持通配符批量删除', async () => {
    const files = ['e1.txt', 'e2.txt', 'e3.txt'].map(tempFile)
    await Promise.all(files.map((f) => write(f, 'z')))
    await remove(`${TEMP_DIR}/e*.txt`)
    for (const f of files) expect(await isExist(f)).toBe(false)
  })

  it('无匹配文件时应正常返回', async () => {
    await expect(remove(tempFile('notfound.txt'))).resolves.toBeUndefined()
  })

  it('应支持空数组输入', async () => {
    await expect(remove([])).resolves.toBeUndefined()
  })

  it('应支持重复路径及不存在文件删除', async () => {
    const file = tempFile('dup.txt')
    await write(file, '1')
    await remove([file, file, tempFile('not-exist.txt')])
    expect(await isExist(file)).toBe(false)
  })

  it('应支持并发参数', async () => {
    const files = ['f1.txt', 'f2.txt', 'f3.txt', 'f4.txt'].map(tempFile)
    await Promise.all(files.map((f) => write(f, 'c')))
    await remove(files, { concurrency: 2 })
    for (const f of files) expect(await isExist(f)).toBe(false)
  })

  it('应递归删除多级目录', async () => {
    const dir = tempFile('deep')
    const sub = `${dir}/sub`
    await mkdir(sub)
    await write(`${sub}/deep.txt`, 'deep')
    expect(await isExist(dir)).toBe(true)
    await remove(dir)
    expect(await isExist(dir)).toBe(false)
  })
})
