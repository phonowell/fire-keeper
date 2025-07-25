import { beforeEach, describe, expect, it, vi } from 'vitest'

import echo from '../src/echo.js'
import glob from '../src/glob.js'
import read from '../src/read.js'
import recover from '../src/recover.js'
import remove from '../src/remove.js'
import write from '../src/write.js'

// Mock dependencies
vi.mock('../src/echo.js')
vi.mock('../src/glob.js')
vi.mock('../src/read.js')
vi.mock('../src/write.js')
vi.mock('../src/remove.js')

// Helper function to create ListSource type
const createListSource = (paths: string[]) => {
  const result = paths as string[] & { __IS_LISTED_AS_SOURCE__: true }
  result.__IS_LISTED_AS_SOURCE__ = true
  return result
}

describe('recover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应正常恢复单个文件', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['test.txt.bak']))
    vi.mocked(read).mockResolvedValue('backup content')
    vi.mocked(write).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await recover('test.txt')

    expect(glob).toHaveBeenCalledWith(['test.txt.bak'], { onlyFiles: true })
    expect(read).toHaveBeenCalledWith('test.txt.bak')
    expect(write).toHaveBeenCalledWith('test.txt', 'backup content')
    expect(remove).toHaveBeenCalledWith('test.txt.bak')
    expect(echo).toHaveBeenCalledWith('recover', expect.stringContaining('recovered'))
  })

  it('应正常恢复多个文件', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['file1.txt.bak', 'file2.txt.bak']))
    vi.mocked(read).mockResolvedValue('content')
    vi.mocked(write).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await recover(['file1.txt', 'file2.txt'])

    expect(glob).toHaveBeenCalledWith(['file1.txt.bak', 'file2.txt.bak'], { onlyFiles: true })
    expect(read).toHaveBeenCalledTimes(2)
    expect(write).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('应支持自定义并发数', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['test.txt.bak']))
    vi.mocked(read).mockResolvedValue('content')
    vi.mocked(write).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await recover('test.txt', { concurrency: 3 })

    expect(read).toHaveBeenCalledWith('test.txt.bak')
    expect(write).toHaveBeenCalledWith('test.txt', 'content')
    expect(remove).toHaveBeenCalledWith('test.txt.bak')
  })

  it('无备份文件时应输出提示信息', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource([]))

    await recover('nonexistent.txt')

    expect(echo).toHaveBeenCalledWith('recover', expect.stringContaining('no files found'))
  })

  it('读取失败时应抛出错误', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['test.txt.bak']))
    vi.mocked(read).mockRejectedValue(new Error('read error'))

    await expect(recover('test.txt')).rejects.toThrow()
  })

  it('写入失败时应抛出错误', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['test.txt.bak']))
    vi.mocked(read).mockResolvedValue('content')
    vi.mocked(write).mockRejectedValue(new Error('write error'))

    await expect(recover('test.txt')).rejects.toThrow()
  })

  it('删除备份文件失败时应抛出错误', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['test.txt.bak']))
    vi.mocked(read).mockResolvedValue('content')
    vi.mocked(write).mockResolvedValue(undefined)
    vi.mocked(remove).mockRejectedValue(new Error('remove error'))

    await expect(recover('test.txt')).rejects.toThrow()
  })

  it('应正确处理空内容的备份文件', async () => {
    vi.mocked(glob).mockResolvedValue(createListSource(['empty.txt.bak']))
    vi.mocked(read).mockResolvedValue('')
    vi.mocked(write).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await recover('empty.txt')

    expect(write).toHaveBeenCalledWith('empty.txt', '')
    expect(echo).toHaveBeenCalledWith('recover', expect.stringContaining('recovered'))
  })
})
