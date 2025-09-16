import isExist from 'src/isExist.js'
import remove from 'src/remove.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import mkdir from '../src/mkdir.js'

// 只 mock echo，其他均用真实依赖
vi.mock('../src/echo.js')

const TEMP_DIR = `./temp/mkdir`
const tempDirs = [
  `${TEMP_DIR}/single`,
  `${TEMP_DIR}/multi1`,
  `${TEMP_DIR}/multi2`,
  `${TEMP_DIR}/nested/a/b`,
  `${TEMP_DIR}/empty`,
  `${TEMP_DIR}/fail`,
]

describe('mkdir 单元测试', () => {
  beforeEach(async () => {
    await remove(TEMP_DIR)
    await mkdir(TEMP_DIR)
    vi.clearAllMocks()
    vi.mocked(echo).mockImplementation(() => undefined)
  })

  afterEach(async () => {
    await remove(TEMP_DIR)
    vi.restoreAllMocks()
  })

  it('应正常创建单个目录', async () => {
    const dir = tempDirs[0]
    await mkdir(dir)
    expect(await isExist(dir)).toBe(true)
    expect(echo).toHaveBeenCalledWith(
      'mkdir',
      expect.stringContaining('created'),
    )
  })

  it('应正常创建多个目录', async () => {
    const dirs = [tempDirs[1], tempDirs[2]]
    await mkdir(dirs)
    expect(await isExist(dirs[0])).toBe(true)
    expect(await isExist(dirs[1])).toBe(true)
    expect(echo).toHaveBeenCalledWith(
      'mkdir',
      expect.stringContaining('created'),
    )
  })

  it('应支持嵌套目录', async () => {
    const nested = tempDirs[3]
    await mkdir(nested)
    expect(await isExist(nested)).toBe(true)
  })

  it('应过滤空路径', async () => {
    const valid = tempDirs[4]
    await mkdir(['', valid])
    expect(await isExist(valid)).toBe(true)
  })

  it('无有效路径时应直接返回', async () => {
    await mkdir([])
    expect(echo).not.toHaveBeenCalled()
  })

  it('创建失败时应抛出错误', async () => {
    // 使用无效的路径来模拟失败（在 Windows 上使用非法字符）
    const invalidPath =
      process.platform === 'win32'
        ? `${TEMP_DIR}/invalid<>:"|?*path` // Windows 非法字符
        : `${TEMP_DIR}/\0invalidpath` // Unix 非法字符

    let error: unknown = null
    try {
      await mkdir(invalidPath)
    } catch (e) {
      error = e
    }
    expect(error).toBeTruthy()
  })
})
