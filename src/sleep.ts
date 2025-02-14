import echo from './echo'

/**
 * Sleep for a while.
 * @param delay The delay in milliseconds.
 * @returns The promise.
 * @example
 * ```
 * await sleep(1000)
 * ```
 */
const sleep = async (delay = 0) => {
  await new Promise(resolve => setTimeout(resolve, delay))
  if (delay) echo('sleep', `slept '${delay} ms'`)
}

export default sleep
