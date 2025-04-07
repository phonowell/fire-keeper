/**
 * Flattens a nested array structure into a single-level array.
 * Preserves the type and order of elements while removing nesting.
 *
 * @template T - The type of elements in the array
 * @param {(T | T[])[]} input - The nested array to flatten
 * @returns {T[]} A new array with all nested elements at the top level
 *
 * @example
 * ```typescript
 * // Basic flattening
 * flatten([1, [2, 3], [4]])  // [1, 2, 3, 4]
 *
 * // Empty arrays are removed
 * flatten([1, [], [2], [], [3]])  // [1, 2, 3]
 *
 * // Works with any type
 * flatten(['a', ['b', 'c']])  // ['a', 'b', 'c']
 *
 * // Complex types are preserved
 * interface User { id: number }
 * const users: (User | User[])[] = [
 *   { id: 1 },
 *   [{ id: 2 }, { id: 3 }]
 * ]
 * flatten(users)  // [{ id: 1 }, { id: 2 }, { id: 3 }]
 *
 * // Handles deeply nested structures
 * flatten([1, [2, [3, [4]]]])  // [1, 2, 3, 4]
 * ```
 */
const flatten = <T>(array: (T | T[])[]): T[] =>
  array.reduce<T[]>(
    (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
    [],
  )

export default flatten
