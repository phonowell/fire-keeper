/**
 * Returns the index of the first element in an array that satisfies the provided testing function.
 * Safely handles array modifications, closure variables, and type predicates.
 * Optimized for large arrays with early termination.
 *
 * @template T - The type of elements in the array
 * @param {T[]} list - The array to search through
 * @param {function(T, number, T[]): boolean} fn - The testing function
 *   - param {T} value - The current element being processed in the array
 *   - param {number} index - The index of the current element being processed
 *   - param {T[]} array - The array findIndex was called upon
 * @returns {number} The index of the first element that passes the test; -1 if no element passes
 *
 * @example
 * // Basic usage with primitive types
 * const numbers = [1, 3, 4, 6, 7]
 * findIndex(numbers, x => x % 2 === 0) // returns 2
 *
 * // Complex conditions with early termination
 * findIndex(numbers, x => x > 3 && x % 2 === 0) // returns 3
 *
 * // Works with objects and type safety
 * type User = { id: number, name: string }
 * const users: User[] = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ]
 * findIndex(users, user => user.id === 2) // returns 1
 *
 * // Safe with null/undefined values
 * const mixed = [0, null, undefined, 1]
 * findIndex(mixed, x => x === null) // returns 1
 *
 * // Type predicates for better type inference
 * findIndex(users, (user): user is User => user.id === 2)
 *
 * // Closures and side effects handled safely
 * let count = 0
 * findIndex(numbers, x => {
 *   count++ // Side effect in predicate is safe
 *   return x === 3
 * })
 */
const findIndex = <T>(
  list: T[],
  fn: (value: T, index: number, array: T[]) => boolean,
): number => {
  const safeCopy = [...list]
  for (let i = 0; i < list.length; i++) if (fn(list[i], i, safeCopy)) return i

  return -1
}

export default findIndex
