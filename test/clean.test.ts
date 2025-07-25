import { beforeEach, describe, expect, it, vi } from 'vitest'

import clean from '../src/clean.js'
import * as echo from '../src/echo.js'
import * as getDirname from '../src/getDirname.js'
import * as glob from '../src/glob.js'
import * as remove from '../src/remove.js'
describe('clean', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应正常删除文件及空父目录', async () => {
    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('temp')
    await clean('temp/a.txt')
    expect(removeMock).toHaveBeenCalledTimes(2)
    expect(removeMock).toHaveBeenCalledWith('temp/a.txt')
    expect(removeMock).toHaveBeenCalledWith('temp')
  })

  it('无匹配文件时应输出提示', async () => {
    vi.spyOn(glob, 'default').mockResolvedValue(
      [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
    )
    const echoMock = vi.spyOn(echo, 'default').mockImplementation(() => {})
    await clean('notfound.txt')
    expect(echoMock).toHaveBeenCalledTimes(1)
    expect(echoMock).toHaveBeenCalledWith(
      'clean',
      expect.stringContaining('no files found'),
    )
  })

  it('有文件但父目录不为空时不删除目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['temp/b.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(['temp/b.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('temp')
    await clean('temp/b.txt')
    expect(removeMock).toHaveBeenCalledTimes(1)
    expect(removeMock).toHaveBeenCalledWith('temp/b.txt')
    expect(removeMock).not.toHaveBeenCalledWith('temp')
  })

  it('异常时应抛出错误', async () => {
    vi.spyOn(glob, 'default').mockRejectedValue(new Error('glob error'))
    await expect(clean('*.txt')).rejects.toThrow('glob error')
  })

  it('支持数组参数，全部删除且父目录为空则删除目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['temp/a.txt', 'temp/b.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('temp')
    await clean(['temp/a.txt', 'temp/b.txt'])
    expect(removeMock).toHaveBeenCalledWith(['temp/a.txt', 'temp/b.txt'])
    expect(removeMock).toHaveBeenCalledWith('temp')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })

  it('父目录为多层嵌套时，删除最顶层空目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['a/b/c/d.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('a/b/c')
    await clean('a/b/c/d.txt')
    expect(removeMock).toHaveBeenCalledWith('a/b/c/d.txt')
    expect(removeMock).toHaveBeenCalledWith('a/b/c')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })

  it('删除目录本身（无文件时）', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['emptydir/'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('emptydir')
    await clean('emptydir/')
    expect(removeMock).toHaveBeenCalledWith('emptydir/')
    expect(removeMock).toHaveBeenCalledWith('emptydir')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })

  it('glob pattern 匹配多个文件，父目录不为空时不删除目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['temp/a.txt', 'temp/b.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(['temp/a.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('temp')
    await clean('temp/*.txt')
    expect(removeMock).toHaveBeenCalledWith('temp/*.txt')
    expect(removeMock).not.toHaveBeenCalledWith('temp')
    expect(removeMock).toHaveBeenCalledTimes(1)
  })

  it('source 为空数组时应输出提示', async () => {
    vi.spyOn(glob, 'default').mockResolvedValue(
      [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
    )
    const echoMock = vi.spyOn(echo, 'default').mockImplementation(() => {})
    await clean([])
    expect(echoMock).toHaveBeenCalledTimes(1)
    expect(echoMock).toHaveBeenCalledWith(
      'clean',
      expect.stringContaining('no files found'),
    )
  })

  it('源为目录但目录非空时不删除目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['/temp'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(['/temp/a.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('/temp')
    await clean('/temp')
    expect(removeMock).toHaveBeenCalledWith('/temp')
    expect(removeMock).not.toHaveBeenCalledWith('/')
  })
  it('源为符号链接时应正常处理', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['/temp/link.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('/temp')
    await clean('/temp/link.txt')
    expect(removeMock).toHaveBeenCalledWith('/temp/link.txt')
    expect(removeMock).toHaveBeenCalledWith('/temp')
  })
  it('源为不存在的目录/文件混合时应输出提示', async () => {
    vi.spyOn(glob, 'default').mockResolvedValue(
      [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
    )
    const echoMock = vi.spyOn(echo, 'default').mockImplementation(() => {})
    await clean(['/notfound.txt', '/notfound/dir'])
    expect(echoMock).toHaveBeenCalledTimes(1)
    expect(echoMock).toHaveBeenCalledWith(
      'clean',
      expect.stringContaining('no files found'),
    )
  })
  it('源为嵌套数组时应全部删除', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['/temp/a.txt', '/temp/b.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('/temp')
    await clean([['/temp/a.txt', '/temp/b.txt']].flat())
    expect(removeMock).toHaveBeenCalledWith(['/temp/a.txt', '/temp/b.txt'])
    expect(removeMock).toHaveBeenCalledWith('/temp')
  })

  it('source 为空字符串时应输出提示', async () => {
    vi.spyOn(glob, 'default').mockResolvedValue(
      [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
    )
    const echoMock = vi.spyOn(echo, 'default').mockImplementation(() => {})
    await clean('')
    expect(echoMock).toHaveBeenCalledTimes(1)
    expect(echoMock).toHaveBeenCalledWith(
      'clean',
      expect.stringContaining('no files found'),
    )
  })

  it('source 为特殊字符路径时应正常处理', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['temp/!@#$.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })
      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )
    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('temp')
    await clean('temp/!@#$.txt')
    expect(removeMock).toHaveBeenCalledWith('temp/!@#$.txt')
    expect(removeMock).toHaveBeenCalledWith('temp')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })

  it('source 为目录和文件混合时应全部删除', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce([
        '/temp/a.txt',
        '/temp/b/',
        '/temp/c.log',
      ] as string[] & { __IS_LISTED_AS_SOURCE__: true })
      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )
    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('/temp')
    await clean(['/temp/a.txt', '/temp/b/', '/temp/c.log'])
    expect(removeMock).toHaveBeenCalledWith([
      '/temp/a.txt',
      '/temp/b/',
      '/temp/c.log',
    ])
    expect(removeMock).toHaveBeenCalledWith('/temp')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })

  it('source 为根目录时不应删除根目录', async () => {
    vi.spyOn(glob, 'default')
      .mockResolvedValueOnce(['/temp/a.txt'] as string[] & {
        __IS_LISTED_AS_SOURCE__: true
      })

      .mockResolvedValueOnce(
        [] as unknown as string[] & { __IS_LISTED_AS_SOURCE__: true },
      )

    const removeMock = vi.spyOn(remove, 'default').mockResolvedValue(undefined)
    vi.spyOn(getDirname, 'default').mockReturnValue('/temp')
    await clean('/temp/a.txt')
    expect(removeMock).toHaveBeenCalledWith('/temp/a.txt')
    expect(removeMock).toHaveBeenCalledWith('/temp')
    expect(removeMock).toHaveBeenCalledTimes(2)
  })
})
