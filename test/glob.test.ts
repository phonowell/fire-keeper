import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import glob from '../src/glob.js'
import mkdir from '../src/mkdir.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

const TEMP_DIR = './temp/glob'

const setupTemp = async () => {
  await mkdir(`${TEMP_DIR}/subdir`)
  await mkdir(`${TEMP_DIR}/subdir2`)
  await write(`${TEMP_DIR}/.dotfile`, 'dot')
  await write(`${TEMP_DIR}/normal.txt`, 'txt')
  await write(`${TEMP_DIR}/subdir/file1.ts`, 'ts')
  await write(`${TEMP_DIR}/subdir/.hidden`, 'hidden')
  await write(`${TEMP_DIR}/subdir2/file2.ts`, 'ts2')
  await write(`${TEMP_DIR}/subdir2/file3.js`, 'js3')
}
const cleanupTemp = async () => {
  await remove(TEMP_DIR)
}

describe('glob', () => {
  beforeAll(setupTemp)
  afterAll(cleanupTemp)

  it('基本模式匹配', async () => {
    const result = await glob('src/*.ts')
    expect(Array.isArray(result)).toBe(true)
    expect(result.some((p) => p.endsWith('src/glob.ts'))).toBe(true)
  })

  it('空输入返回空数组', async () => {
    expect((await glob('')).length).toBe(0)
    expect((await glob([])).length).toBe(0)
  })

  it('无匹配结果返回空数组', async () => {
    const result = await glob(`${TEMP_DIR}/not-exist.*`)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('边界情况', async () => {
    expect((await glob([''])).length).toBe(0)
    expect((await glob('not_exist_dir/*')).length).toBe(0)
    const result = await glob(`${TEMP_DIR}/subdir/*[a-z]*.ts`)
    expect(result.length).toBe(1)
    expect(result.at(0)?.endsWith('file1.ts')).toBe(true)
  })
})
