// function

/**
 * Check if the input is an object.
 * @param input The input.
 * @returns The assertion result.
 * @example
 * ```
 * isObject({ key: 'value' })
 * //=> true
 * isObject('hello')
 * //=> false
 * ```
 */
const isObject = <T extends Record<string, unknown>>(
  input: unknown,
): input is T =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

// export
export default isObject
