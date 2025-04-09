/**
 * Flattens nested arrays into a single-level array
 * @template T - Element type
 * @param {(T | T[])[]} input - Nested array to flatten
 * @returns {T[]} Single-level array with preserved order
 *
 * @example
 * // Basic flattening
 * flatten([1, [2, [3]], 4]) // [1, 2, 3, 4]
 *
 * // With complex types
 * flatten([user, [user2], [[user3]]]) // [user, user2, user3]
 */
const flatten = <T>(array: (T | T[])[]): T[] =>
  array.reduce<T[]>(
    (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
    [],
  )

export default flatten
