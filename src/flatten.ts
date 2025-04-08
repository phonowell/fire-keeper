/**
 * Flattens a nested array structure into a single-level array.
 * Preserves types, order, and special values while removing all levels of nesting.
 * Optimized for both small and large recursive structures.
 *
 * @template T - The type of elements in the array
 * @param {(T | T[])[]} input - The nested array to flatten
 * @returns {T[]} A new array with all nested elements at the top level, preserving order
 *
 * @example
 * // Basic array flattening
 * flatten([1, [2, 3], [4]])  // [1, 2, 3, 4]
 *
 * // Deep nesting is fully flattened
 * flatten([1, [2, [3, [4]]]])  // [1, 2, 3, 4]
 *
 * // Empty arrays are removed
 * flatten([1, [], [2], [], 3])  // [1, 2, 3]
 *
 * // Special values are preserved
 * flatten([1, [null], [undefined]])  // [1, null, undefined]
 *
 * // Works with mixed types
 * flatten(['a', [1, [true]], [new Date()]])
 *
 * // Preserves complex types
 * interface User {
 *   id: number
 *   name: string
 * }
 * const users: (User | User[])[] = [
 *   { id: 1, name: 'John' },
 *   [{ id: 2, name: 'Jane' }]
 * ]
 * flatten(users)  // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 *
 * // Type-safe with recursive structures
 * type RecursiveArray = number | RecursiveArray[]
 * const nested: RecursiveArray[] = [1, [2, [3]]]
 * flatten(nested)  // [1, 2, 3]
 */
const flatten = <T>(array: (T | T[])[]): T[] =>
  array.reduce<T[]>(
    (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
    [],
  )

export default flatten
