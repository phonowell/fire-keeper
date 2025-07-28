import path from 'path'

import fse from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import mkdir from '../src/mkdir.js'

// 只 mock echo，其他均用真实依赖
vi.mock('../src/echo.js')

const tempRoot = path.join(process.cwd(), 'temp', 'mkdir-unit')
const tempDirs = [
  path.join(tempRoot, 'single'),
  path.join(tempRoot, 'multi1'),
  path.join(tempRoot, 'multi2'),
  path.join(tempRoot, 'nested', 'a', 'b'),
  path.join(tempRoot, 'empty'),
  path.join(tempRoot, 'fail'),
]

describe('mkdir 单元测试', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.mocked(echo).mockImplementation(() => undefined)
    await fse.remove(tempRoot)
    await fse.ensureDir(tempRoot)
  })

  afterEach(async () => {
    await fse.remove(tempRoot)
    vi.restoreAllMocks()
  })

  it('应正常创建单个目录', async () => {
    const dir = tempDirs[0]
    await mkdir(dir)
    expect(await fse.pathExists(dir)).toBe(true)
    expect(echo).toHaveBeenCalledWith(
      'mkdir',
      expect.stringContaining('created'),
    )
  })

  it('应正常创建多个目录', async () => {
    const dirs = [tempDirs[1], tempDirs[2]]
    await mkdir(dirs)
    expect(await fse.pathExists(dirs[0])).toBe(true)
    expect(await fse.pathExists(dirs[1])).toBe(true)
    expect(echo).toHaveBeenCalledWith(
      'mkdir',
      expect.stringContaining('created'),
    )
  })

  it('应支持嵌套目录', async () => {
    const nested = tempDirs[3]
    await mkdir(nested)
    expect(await fse.pathExists(nested)).toBe(true)
  })

  it('应过滤空路径', async () => {
    const valid = tempDirs[4]
    await mkdir(['', valid])
    expect(await fse.pathExists(valid)).toBe(true)
  })

  it('无有效路径时应直接返回', async () => {
    await mkdir([])
    expect(echo).not.toHaveBeenCalled()
  })

  it('创建失败时应抛出错误', async () => {
    // 创建只读目录模拟失败
    const readonlyDir = path.join(tempRoot, 'readonly')
    await fse.ensureDir(readonlyDir)
    await fse.chmod(readonlyDir, 0o444)
    const invalid = path.join(readonlyDir, 'sub')
    let error: unknown = null
    try {
      await mkdir(invalid)
    } catch (e) {
      error = e
    } finally {
      await fse.chmod(readonlyDir, 0o755)
    }
    expect(error).toBeTruthy()
  })
})
