/**
 * Returns the index of the first element in an array that satisfies the provided testing function.
 * @template T - The type of elements in the array
 * @param {T[]} list - The array to search through
 * @param {function(T, number, T[]): boolean} fn - The testing function
 *   - param {T} value - The current element being processed in the array
 *   - param {number} index - The index of the current element being processed
 *   - param {T[]} array - The array findIndex was called upon
 * @returns {number} The index of the first element that passes the test; -1 if no element passes
 * @example
 * ```typescript
 * // Find index of first even number
 * const numbers = [1, 3, 4, 6, 7];
 * const evenIndex = findIndex(numbers, x => x % 2 === 0); // returns 2
 *
 * // Find index of specific object in array
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const userIndex = findIndex(users, user => user.id === 2); // returns 1
 *
 * // When no element is found
 * const notFound = findIndex([1, 3, 5], x => x > 10); // returns -1
 * ```
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
