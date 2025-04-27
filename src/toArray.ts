/**
 * Convert any value to an array. If already an array, returns it unchanged.
 * @template T - The type of elements in the array
 * @param input - The value to convert to an array
 * @returns An array containing the input value, or the input itself if already an array
 * @example
 * ```
 * toArray(42)          // [42]
 * toArray('hello')     // ['hello']
 * toArray([1, 2, 3])   // [1, 2, 3]
 * toArray({key: 'value'}) // [{key: 'value'}]
 * ```
 */
const toArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input]

export default toArray
