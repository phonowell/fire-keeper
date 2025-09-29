/**
 * Convert any value to an array format
 * @template T - Element type
 * @param input - Value to convert (returns unchanged if already array)
 * @returns Array containing the input or the original array
 * @example
 * toArray('hello')     // ['hello']
 * toArray([1, 2, 3])   // [1, 2, 3] (unchanged)
 */
const toArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input]

export default toArray
