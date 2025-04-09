/**
 * Find the first array element's index that matches a predicate
 * @template T - Array element type
 * @param {T[]} list - The array to search
 * @param {function(T, number, T[]): boolean} fn - Test function
 * @returns {number} First matching index or -1 if not found
 *
 * @example
 * // Basic search
 * findIndex([1, 2, 3], x => x > 1) // returns 1
 *
 * // With objects
 * findIndex(users, u => u.id === 2)
 *
 * // Type-safe predicate
 * findIndex(items, (x): x is Item => x.type === 'test')
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
