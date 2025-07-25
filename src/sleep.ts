import echo from './echo.js'

/**
 * Sleep for a specified duration.
 * @param delay The delay in milliseconds. Default is 0ms.
 * Negative values are treated as 0. Float values are accepted.
 * When delay > 0, logs a message with the sleep duration.
 * @returns A promise that resolves after the delay.
 * @example
 * ```
 * await sleep(1000) // sleeps for 1 second
 * await sleep() // minimal delay
 * ```
 */
const sleep = async (delay: number = 0): Promise<void> => {
  // 类型安全处理，负数视为0，非数值或NaN视为0
  const ms = typeof delay === 'number' && !isNaN(delay) ? Math.max(0, delay) : 0
  await new Promise<void>((resolve) => setTimeout(resolve, ms))
  if (ms > 0) echo('sleep', `slept '${ms} ms'`)
}

export default sleep
