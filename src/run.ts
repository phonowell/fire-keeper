/**
 * Executes a function and returns its result. Useful for immediately invoking functions
 * that return values or have side effects.
 *
 * @template T - The return type of the function
 * @param {(...args: unknown[]) => T} fn - The function to execute. Can be an arrow function,
 *                                        regular function, or any callable that returns type T
 * @returns {T} The value returned by the function
 *
 * @example
 * ```typescript
 * // Basic value return
 * const value = run(() => 42)  // returns 42
 *
 * // Object return with type preservation
 * interface Config { port: number }
 * const config = run<Config>(() => ({ port: 3000 }))
 *
 * // Side effects
 * run(() => {
 *   console.log('Side effect')
 *   localStorage.clear()
 * })
 * ```
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

export default run
