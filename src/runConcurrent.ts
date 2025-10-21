/**
 * Execute async tasks concurrently with controlled parallelism
 * @template T - Result type returned by tasks
 * @param concurrency - Maximum parallel tasks
 * @param tasks - Array of async task functions
 * @param options - Configuration (stopOnError)
 * @returns Promise resolving to array of results in original order
 */
const runConcurrent = async <T>(
  concurrency: number,
  tasks: (() => Promise<T>)[],
  options: { stopOnError?: boolean } = {},
): Promise<T[]> => {
  const results: T[] = new Array(tasks.length)
  const errors: Error[] = []
  let currentIndex = 0

  const worker = async (): Promise<void> => {
    while (currentIndex < tasks.length) {
      const index = currentIndex++
      const task = tasks.at(index)
      try {
        if (task) results[index] = await task()
      } catch (error) {
        errors.push(error as Error)
        if (options.stopOnError) throw error
      }
    }
  }

  await Promise.all(
    Array(Math.min(concurrency, tasks.length)).fill(null).map(worker),
  )

  if (errors.length > 0 && !options.stopOnError)
    throw new AggregateError(errors, 'Some tasks failed to execute')

  return results
}

export default runConcurrent
