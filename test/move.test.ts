import { beforeEach, describe, expect, it, vi } from 'vitest'

import copy from '../src/copy.js'
import move from '../src/move.js'
import remove from '../src/remove.js'

// Mock dependencies
vi.mock('../src/copy.js')
vi.mock('../src/remove.js')

describe('move', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应正常移动文件', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await move('a.txt', 'dist/')

    expect(copy).toHaveBeenCalledWith('a.txt', 'dist/', { concurrency: 5 })
    expect(remove).toHaveBeenCalledWith('a.txt', { concurrency: 5 })
  })

  it('应正常移动多个文件', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await move(['file1.txt', 'file2.txt'], 'dist/')

    expect(copy).toHaveBeenCalledWith(['file1.txt', 'file2.txt'], 'dist/', { concurrency: 5 })
    expect(remove).toHaveBeenCalledWith(['file1.txt', 'file2.txt'], { concurrency: 5 })
  })

  it('应支持目标路径生成函数', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)
    const targetFn = (name: string) => `backup/${name}`

    await move('file.txt', targetFn)

    expect(copy).toHaveBeenCalledWith('file.txt', targetFn, { concurrency: 5 })
    expect(remove).toHaveBeenCalledWith('file.txt', { concurrency: 5 })
  })

  it('应支持自定义并发数', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await move('file.txt', 'dist/', { concurrency: 2 })

    expect(copy).toHaveBeenCalledWith('file.txt', 'dist/', { concurrency: 2 })
    expect(remove).toHaveBeenCalledWith('file.txt', { concurrency: 2 })
  })

  it('应使用默认并发数', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockResolvedValue(undefined)

    await move('file.txt', 'dist/')

    expect(copy).toHaveBeenCalledWith('file.txt', 'dist/', { concurrency: 5 })
    expect(remove).toHaveBeenCalledWith('file.txt', { concurrency: 5 })
  })

  it('copy 失败时应抛出错误', async () => {
    vi.mocked(copy).mockRejectedValue(new Error('copy error'))
    vi.mocked(remove).mockResolvedValue(undefined)

    await expect(move('file.txt', 'dist/')).rejects.toThrow('copy error')
    expect(remove).not.toHaveBeenCalled()
  })

  it('remove 失败时应抛出错误', async () => {
    vi.mocked(copy).mockResolvedValue(undefined)
    vi.mocked(remove).mockRejectedValue(new Error('remove error'))

    await expect(move('file.txt', 'dist/')).rejects.toThrow('remove error')
    expect(copy).toHaveBeenCalledWith('file.txt', 'dist/', { concurrency: 5 })
  })
})
