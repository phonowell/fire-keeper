import { describe, expect, it } from 'vitest'

import runConcurrent from '../src/runConcurrent.js'

describe('runConcurrent', () => {
  it('应并发执行所有异步任务并返回结果（顺序一致）', async () => {
    const tasks: Array<() => Promise<number>> = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ]
    const result = await runConcurrent(2, tasks)
    expect(result).toEqual([1, 2, 3])
  })

  it('应支持并发数大于任务数', async () => {
    const tasks: Array<() => Promise<string>> = [
      () => Promise.resolve('a'),
      () => Promise.resolve('b'),
    ]
    const result = await runConcurrent(5, tasks)
    expect(result).toEqual(['a', 'b'])
  })

  it('遇到错误时应停止执行且只抛第一个错误（stopOnError=true）', async () => {
    const tasks: Array<() => Promise<number>> = [
      () => Promise.resolve(1),
      () => Promise.reject(new Error('fail')),
      () => Promise.resolve(3),
    ]
    await expect(
      runConcurrent(2, tasks, { stopOnError: true }),
    ).rejects.toThrow('fail')
  })

  it('应聚合所有错误（stopOnError=false）且抛出AggregateError', async () => {
    const tasks: Array<() => Promise<number>> = [
      () => Promise.reject(new Error('err1')),
      () => Promise.resolve(2),
      () => Promise.reject(new Error('err2')),
    ]
    await expect(runConcurrent(2, tasks)).rejects.toThrow(AggregateError)
    await expect(runConcurrent(2, tasks)).rejects.toMatchObject({
      errors: [
        expect.objectContaining({ message: 'err1' }),
        expect.objectContaining({ message: 'err2' }),
      ],
    })
  })

  it('应返回空数组（无任务）', async () => {
    const result = await runConcurrent(3, [])
    expect(result).toEqual([])
  })

  it('异步任务耗时不同但结果顺序一致', async () => {
    const tasks: Array<() => Promise<string>> = [
      () => new Promise((res) => setTimeout(() => res('A'), 30)),
      () => new Promise((res) => setTimeout(() => res('B'), 10)),
      () => new Promise((res) => setTimeout(() => res('C'), 20)),
    ]
    const result = await runConcurrent(2, tasks)
    expect(result).toEqual(['A', 'B', 'C'])
  })

  // 并发数为0属于类型约束外场景，移除该用例

  it('所有任务均失败时应聚合所有错误', async () => {
    const tasks: Array<() => Promise<number>> = [
      () => Promise.reject(new Error('errA')),
      () => Promise.reject(new Error('errB')),
    ]
    await expect(runConcurrent(2, tasks)).rejects.toThrow(AggregateError)
    await expect(runConcurrent(2, tasks)).rejects.toMatchObject({
      errors: [
        expect.objectContaining({ message: 'errA' }),
        expect.objectContaining({ message: 'errB' }),
      ],
    })
  })

  it('部分任务抛出非 Error 类型也能聚合', async () => {
    const tasks: Array<() => Promise<number>> = [
      () => Promise.reject('string error'),
      () => Promise.reject(new Error('errObj')),
    ]
    await expect(runConcurrent(2, tasks)).rejects.toThrow(AggregateError)
    await expect(runConcurrent(2, tasks)).rejects.toMatchObject({
      errors: ['string error', expect.objectContaining({ message: 'errObj' })],
    })
  })

  // stopOnError 结果已在前述用例断言，移除重复
})
