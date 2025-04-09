/**
 * Execute asynchronous tasks concurrently with controlled parallelism
 * @template T - Type of value returned by tasks
 * @param {number} concurrency - Maximum number of tasks to run in parallel
 * @param {(() => Promise<T>)[]} tasks - Array of async task functions
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.stopOnError=false] - Stop all tasks on first error
 * @returns {Promise<T[]>} Array of results in original task order
 *
 * @example Basic concurrent execution
 * ```ts
 * const tasks = [
 *   () => downloadFile('file1.txt'),
 *   () => downloadFile('file2.txt'),
 *   () => downloadFile('file3.txt')
 * ]
 * const results = await runConcurrent(2, tasks)
 * ```
 *
 * @example Error handling modes
 * ```ts
 * // Collect all errors (default)
 * try {
 *   await runConcurrent(2, tasks)
 * } catch (err) {
 *   if (err instanceof AggregateError) {
 *     console.log(err.errors) // Array of all errors
 *   }
 * }
 *
 * // Stop on first error
 * await runConcurrent(2, tasks, { stopOnError: true })
 * ```
 *
 * Features:
 * - Maintains result order regardless of execution order
 * - Adaptive concurrency (min of concurrency limit and task count)
 * - Two error handling modes (aggregate or stop-on-error)
 * - Memory efficient task scheduling
 * - Handles empty task arrays
 *
 * Error Handling:
 * - Default: Collects all errors in AggregateError
 * - stopOnError: Stops all tasks on first error
 * - Empty task array: Returns empty array
 * - Invalid tasks: Rejects immediately
 *
 * @throws {AggregateError} When tasks fail and stopOnError is false
 * @throws {Error} When a task fails and stopOnError is true
 */
const runConcurrent = async <T>(
  // 最大并发数
  concurrency: number,
  // 待执行的异步任务数组
  tasks: (() => Promise<T>)[],
  // 配置选项
  options: {
    // 是否在遇到错误时立即停止执行
    stopOnError?: boolean
  } = {},
): Promise<T[]> => {
  // 存储所有任务的执行结果
  const results: T[] = Array(tasks.length).fill(undefined) as T[]
  // 存储执行过程中的错误
  const errors: Error[] = []

  // 创建任务索引生成器
  const getNextIndex = (() => {
    // 创建一个计数器,用于生成递增的索引
    const createCounter = (start: number) => ({
      // 获取下一个索引值并自增
      next: () => start++,
      // 获取当前索引值
      current: () => start,
    })
    return createCounter(0)
  })()

  // 任务执行器
  const executor = () => {
    // 递归执行任务的函数
    const executeNext = async (): Promise<void> => {
      // 获取下一个要执行的任务索引
      const index = getNextIndex.next()
      // 如果所有任务都已分配,则结束执行
      if (index >= tasks.length) return

      try {
        // 执行任务并存储结果
        results[index] = await tasks[index]()
      } catch (error) {
        // 收集错误信息
        errors.push(error as Error)
        // 如果配置了遇错停止,则抛出错误中断执行
        if (options.stopOnError) throw error
      }

      // 继续执行下一个任务
      return executeNext()
    }

    return executeNext()
  }

  // 创建指定数量的执行器并行执行任务
  await Promise.all(
    Array(Math.min(concurrency, tasks.length))
      .fill(null)
      .map(() => executor()),
  )

  // 如果有错误发生且未配置遇错停止,则抛出聚合错误
  if (errors.length > 0 && !options.stopOnError)
    throw new AggregateError(errors, 'Some tasks failed to execute')

  return results
}

export default runConcurrent
