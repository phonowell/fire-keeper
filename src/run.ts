/**
 * Executes a function immediately and returns its result with type preservation
 * @template T - The return type of the function
 * @param {(...args: unknown[]) => T} fn - Function to execute
 * @returns {T} The function's return value with preserved type
 *
 * @example Basic usage
 * ```ts
 * // Simple value
 * const num = run(() => 42)
 * //=> 42
 *
 * // Array with type inference
 * const arr = run(() => [1, 2, 3])
 * //=> [1, 2, 3]
 * ```
 *
 * @example Type safety
 * ```ts
 * interface User {
 *   id: number
 *   name: string
 * }
 *
 * const user = run<User>(() => ({
 *   id: 1,
 *   name: 'Alice'
 * }))
 * //=> { id: 1, name: 'Alice' }
 * ```
 *
 * @example Error handling
 * ```ts
 * // Errors propagate normally
 * try {
 *   run(() => {
 *     throw new Error('Failed')
 *   })
 * } catch (err) {
 *   console.error(err)
 * }
 * ```
 *
 * Features:
 * - Type inference and preservation
 * - Supports any callable function
 * - Propagates errors naturally
 * - No parameter passing
 * - Synchronous execution
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

export default run
