/**
 * Convert a value to an array if it is not already an array.
 * @param input - The value to convert to an array.
 * @returns The value as an array.
 * @example
 * ```
 * console.log(toArray(1))
 * //=> [1]
 *
 * console.log(toArray([1, 2, 3]))
 * //=> [1, 2, 3]
 * ```
 */
const toArray = <T>(input: T | T[]): T[] =>
  input instanceof Array ? input : [input]

export default toArray
