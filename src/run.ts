/**
 * Executes a function immediately and returns its result with type preservation
 * @template T - The return type of the function
 * @param {(...args: unknown[]) => T} fn - Function to execute
 * @returns {T} The function's return value with preserved type
 *
 * @example
 * ```ts
 * const num = run(() => 42) //=> 42
 * const user = run<User>(() => ({ id: 1, name: 'Alice' }))
 * ```
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

export default run
