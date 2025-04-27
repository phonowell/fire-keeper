import echo from './echo'

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
const sleep = async (delay = 0) => {
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (delay) echo('sleep', `slept '${delay} ms'`)
}

export default sleep
