import fse from 'fs-extra'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import glob from '../src/glob.js'
import remove from '../src/remove.js'
import runConcurrent from '../src/runConcurrent.js'

describe('remove - Mock 测试', () => {
  vi.mock('../src/echo.js')
  vi.mock('../src/glob.js')
  vi.mock('../src/runConcurrent.js')

  const mockedEcho = vi.mocked(echo)
  const mockedGlob = vi.mocked(glob)
  const mockedRunConcurrent = vi.mocked(runConcurrent)

  // 辅助函数创建带有标记的数组
  const createListSource = (files: string[]) => {
    const result = files as string[] & { __IS_LISTED_AS_SOURCE__: true }
    result.__IS_LISTED_AS_SOURCE__ = true
    return result
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // 默认让 runConcurrent 执行所有任务
    mockedRunConcurrent.mockImplementation(async (_concurrency, tasks) => {
      const results: unknown[] = []
      for (const task of tasks) results.push(await task())

      return results
    })
  })

  it('应正常删除文件和目录', async () => {
    mockedGlob.mockResolvedValue(createListSource(['a.txt', 'b']))
    const fseMock = vi.spyOn(fse, 'remove').mockResolvedValue(undefined)

    await remove(['a.txt', 'b'])

    expect(fseMock).toHaveBeenCalledTimes(2)
    expect(fseMock).toHaveBeenNthCalledWith(1, 'a.txt')
    expect(fseMock).toHaveBeenNthCalledWith(2, 'b')
    expect(mockedEcho).toHaveBeenCalledWith(
      'remove',
      expect.stringContaining('removed'),
    )
  })

  it('无匹配文件时应输出提示', async () => {
    mockedGlob.mockResolvedValue(createListSource([]))

    await remove('notfound.txt')

    expect(mockedEcho).toHaveBeenCalledWith(
      'remove',
      expect.stringContaining('no files found'),
    )
  })

  it('应支持并发参数', async () => {
    mockedGlob.mockResolvedValue(createListSource(['c.txt', 'd.txt']))
    const fseMock = vi.spyOn(fse, 'remove').mockResolvedValue(undefined)

    await remove(['c.txt', 'd.txt'], { concurrency: 2 })

    expect(mockedRunConcurrent).toHaveBeenCalledWith(2, expect.any(Array))
    expect(fseMock).toHaveBeenCalledTimes(2)
  })

  it('glob 抛错时应正确传播错误', async () => {
    mockedGlob.mockRejectedValue(new Error('glob error'))

    await expect(remove('*.ts')).rejects.toThrow('glob error')
  })

  it('fse.remove 抛错时应正确传播错误', async () => {
    mockedGlob.mockResolvedValue(createListSource(['err.txt']))
    vi.spyOn(fse, 'remove').mockRejectedValue(new Error('remove error'))

    await expect(remove('err.txt')).rejects.toThrow('remove error')
  })

  it('应支持单文件字符串输入', async () => {
    mockedGlob.mockResolvedValue(createListSource(['single.txt']))
    const fseMock = vi.spyOn(fse, 'remove').mockResolvedValue(undefined)

    await remove('single.txt')

    expect(fseMock).toHaveBeenCalledTimes(1)
    expect(fseMock).toHaveBeenCalledWith('single.txt')
    expect(mockedEcho).toHaveBeenCalledWith(
      'remove',
      expect.stringContaining('removed'),
    )
  })

  it('应支持空数组输入', async () => {
    mockedGlob.mockResolvedValue(createListSource([]))

    await remove([])

    expect(mockedEcho).toHaveBeenCalledWith(
      'remove',
      expect.stringContaining('no files found'),
    )
  })

  it('并发删除过程中的错误应正确处理', async () => {
    mockedGlob.mockResolvedValue(createListSource(['file1.txt', 'file2.txt']))
    const removeError = new Error('删除失败')
    mockedRunConcurrent.mockRejectedValue(removeError)

    await expect(
      remove(['file1.txt', 'file2.txt'], { concurrency: 2 }),
    ).rejects.toThrow('删除失败')
  })

  it('应支持默认并发参数', async () => {
    mockedGlob.mockResolvedValue(createListSource(['default.txt']))
    const fseMock = vi.spyOn(fse, 'remove').mockResolvedValue(undefined)

    await remove('default.txt')

    expect(mockedRunConcurrent).toHaveBeenCalledWith(5, expect.any(Array))
    expect(fseMock).toHaveBeenCalledWith('default.txt')
  })

  it('应处理重复路径删除', async () => {
    mockedGlob.mockResolvedValue(createListSource(['dup.txt', 'dup.txt']))
    const fseMock = vi.spyOn(fse, 'remove').mockResolvedValue(undefined)

    await remove(['dup.txt', 'dup.txt'])

    expect(fseMock).toHaveBeenCalledTimes(2)
    expect(mockedEcho).toHaveBeenCalledWith(
      'remove',
      expect.stringContaining('removed'),
    )
  })
})
