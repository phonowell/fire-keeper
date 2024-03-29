// function

/**
 * Check if the input is an array.
 * @param input The input.
 * @returns The assertion result.
 * @example
 * ```
 * isArray([1, 2, 3])
 * //=> true
 * isArray('hello')
 * //=> false
 * ```
 */
const isArray = <T extends unknown[]>(input: unknown): input is T =>
  Array.isArray(input)

// export
export default isArray
