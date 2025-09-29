/**
 * Execute a function immediately and return its result
 * @template T - Return type of the function
 * @param fn - Function to execute immediately
 * @returns The function's return value
 * @example
 * const config = run(() => ({ debug: true, port: 3000 }))
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

export default run
