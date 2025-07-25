import fse from 'fs-extra'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import glob from '../src/glob.js'
import link from '../src/link.js'
import normalizePath from '../src/normalizePath.js'

// Mock all dependencies
vi.mock('../src/echo.js')
vi.mock('../src/glob.js')
vi.mock('../src/normalizePath.js')

// Helper function to create ListSource type
const createListSource = (paths: string[]) => {
  const result = paths as string[] & { __IS_LISTED_AS_SOURCE__: true }
  result.__IS_LISTED_AS_SOURCE__ = true
  return result
}

describe('link', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应正常创建文件符号链接', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['src/a.txt']))
    const fseSpy = vi.spyOn(fse, 'ensureSymlink').mockResolvedValue(undefined)
    vi.mocked(normalizePath).mockReturnValue('dist/a.link.txt')

    await link('src/a.txt', 'dist/a.link.txt')

    expect(fseSpy).toHaveBeenCalledWith('src/a.txt', 'dist/a.link.txt')
    expect(echo).toHaveBeenCalledWith('link', expect.stringContaining('linked'))

    fseSpy.mockRestore()
  })

  it('应正常创建目录符号链接', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['src/dir/']))
    const fseSpy = vi.spyOn(fse, 'ensureSymlink').mockResolvedValue(undefined)
    vi.mocked(normalizePath).mockReturnValue('dist/dir.link/')

    await link('src/dir/', 'dist/dir.link/')

    expect(fseSpy).toHaveBeenCalledWith('src/dir/', 'dist/dir.link/')
    expect(echo).toHaveBeenCalledWith('link', expect.stringContaining('linked'))

    fseSpy.mockRestore()
  })

  it('glob 匹配多个源时仅链接第一个', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['src/a.txt', 'src/b.txt']))
    const fseSpy = vi.spyOn(fse, 'ensureSymlink').mockResolvedValue(undefined)
    vi.mocked(normalizePath).mockReturnValue('dist/a.link.txt')

    await link('src/*.txt', 'dist/a.link.txt')

    expect(fseSpy).toHaveBeenCalledWith('src/a.txt', 'dist/a.link.txt')
    expect(fseSpy).not.toHaveBeenCalledWith('src/b.txt', 'dist/a.link.txt')
    expect(echo).toHaveBeenCalledWith('link', expect.stringContaining('linked'))

    fseSpy.mockRestore()
  })

  it('无匹配源文件时应直接返回', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource([]))
    const fseSpy = vi.spyOn(fse, 'ensureSymlink')

    await link('notfound.txt', 'dist/notfound.link.txt')

    expect(fseSpy).not.toHaveBeenCalled()
    expect(echo).not.toHaveBeenCalled()

    fseSpy.mockRestore()
  })

  it('目标路径为空时应直接返回', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['src/a.txt']))
    vi.mocked(normalizePath).mockReturnValue('')
    const fseSpy = vi.spyOn(fse, 'ensureSymlink')

    await link('src/a.txt', '')

    expect(fseSpy).not.toHaveBeenCalled()
    expect(echo).not.toHaveBeenCalled()

    fseSpy.mockRestore()
  })

  it('创建符号链接失败时应抛出错误', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['src/a.txt']))
    vi.mocked(normalizePath).mockReturnValue('dist/a.link.txt')
    const fseSpy = vi.spyOn(fse, 'ensureSymlink').mockRejectedValue(new Error('symlink error'))

    await expect(link('src/a.txt', 'dist/a.link.txt')).rejects.toThrow('symlink error')

    fseSpy.mockRestore()
  })
})
