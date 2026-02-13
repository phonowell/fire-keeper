import echo from './echo.js'

type Options = {
  echo?: boolean
}

/**
 * Sleep for specified milliseconds with optional logging
 * @param delay - Delay in milliseconds (default: 0, negatives treated as 0)
 * @example
 * await sleep(1000)  // Sleep for 1 second
 * await sleep()      // Minimal delay
 */
const sleep = async (
  delay: number = 0,
  { echo: shouldEcho = true }: Options = {},
): Promise<void> => {
  const ms = typeof delay === 'number' && !isNaN(delay) ? Math.max(0, delay) : 0

  await new Promise<void>((resolve) => setTimeout(resolve, ms))

  if (ms > 0 && shouldEcho) echo('sleep', `slept **${ms} ms**`)
}

export default sleep
