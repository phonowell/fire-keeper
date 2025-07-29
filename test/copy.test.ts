import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import clean from '../src/clean.js'
import copy from '../src/copy.js'
import isExist from '../src/isExist.js'
import mkdir from '../src/mkdir.js'
import read from '../src/read.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/copy'

describe('copy', () => {
  beforeEach(async () => {
    await clean(TEMP_DIR)
    await mkdir(TEMP_DIR)
  })

  afterEach(async () => {
    await clean(TEMP_DIR)
  })

  it('应正常复制单个文件，自动生成.copy文件', async () => {
    const src = `${TEMP_DIR}/a.txt`
    await write(src, 'hello')
    await copy(src)
    expect(await read(`${TEMP_DIR}/a.copy.txt`)).toBe('hello')
  })

  it('应支持目标目录为字符串/函数/异步函数', async () => {
    const src = `${TEMP_DIR}/b.txt`
    await write(src, 'world')
    const dist = `${TEMP_DIR}/dist`
    await mkdir(dist)
    await copy(src, dist)
    expect(await read(`${dist}/b.txt`)).toBe('world')

    const distFn = `${TEMP_DIR}/dist_fn`
    await mkdir(distFn)
    await copy(src, () => distFn)
    expect(await read(`${distFn}/b.txt`)).toBe('world')

    const distAsync = `${TEMP_DIR}/dist_async`
    await copy(src, async () => {
      await mkdir(distAsync)
      return distAsync
    })
    expect(await read(`${distAsync}/b.txt`)).toBe('world')
  })

  it('应支持 options 为字符串/函数/异步函数/对象', async () => {
    const src = `${TEMP_DIR}/c.txt`
    await write(src, 'rename')
    await copy(src, undefined, 'renamed.txt')
    expect(await read(`${TEMP_DIR}/renamed.txt`)).toBe('rename')

    await copy(src, undefined, (name: string) =>
      Promise.resolve(`async_${name}`),
    )
    expect(await read(`${TEMP_DIR}/async_c.txt`)).toBe('rename')

    await copy(src, undefined, { filename: 'fixed.txt' })
    expect(await read(`${TEMP_DIR}/fixed.txt`)).toBe('rename')

    await copy(src, undefined, { filename: (name: string) => `fn_${name}` })
    expect(await read(`${TEMP_DIR}/fn_c.txt`)).toBe('rename')
  })

  it('应支持多文件复制及并发参数', async () => {
    const src1 = `${TEMP_DIR}/d.txt`
    const src2 = `${TEMP_DIR}/e.txt`
    await write(src1, 'd')
    await write(src2, 'e')
    await copy([src1, src2])
    expect(await read(`${TEMP_DIR}/d.copy.txt`)).toBe('d')
    expect(await read(`${TEMP_DIR}/e.copy.txt`)).toBe('e')

    await copy([src1, src2], undefined, { concurrency: 2 })
    expect(await isExist(`${TEMP_DIR}/d.copy.txt`)).toBe(true)
    expect(await isExist(`${TEMP_DIR}/e.copy.txt`)).toBe(true)
  })

  it('目标目录不存在时自动创建', async () => {
    const src = `${TEMP_DIR}/f.txt`
    await write(src, 'auto')
    const newDir = `${TEMP_DIR}/newdir`
    await copy(src, newDir)
    expect(await read(`${newDir}/f.txt`)).toBe('auto')
  })

  it('覆盖已有文件', async () => {
    const src = `${TEMP_DIR}/g.txt`
    await write(src, 'old')
    const target = `${TEMP_DIR}/g.copy.txt`
    await write(target, 'will be replaced')
    await copy(src)
    expect(await read(target)).toBe('old')
  })
})
