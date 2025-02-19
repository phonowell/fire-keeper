/**
 * Flattens a nested array structure into a single-level array.
 * @template T - The type of elements in the array
 * @param {(T | T[])[]} array - The array to flatten, which may contain nested arrays
 * @returns {T[]} A new array with all sub-array elements concatenated recursively
 * @example
 * ```typescript
 * // Flatten numbers array
 * const numbers = [1, [2, 3], [4, [5, 6]]];
 * const flat = flatten(numbers); // [1, 2, 3, 4, 5, 6]
 *
 * // Flatten string array
 * const words = ['hello', ['world', ['typescript']]];
 * const flat = flatten(words); // ['hello', 'world', 'typescript']
 *
 * // Empty array returns empty array
 * const empty = flatten([]); // []
 * ```
 */
const flatten = <T>(array: (T | T[])[]): T[] =>
  array.reduce<T[]>(
    (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
    [],
  )

export default flatten
