// function

/**
 * Check if input is a function
 * @param input unknown
 * @returns boolean
 * @example
 * ```
 * if (isFunction(() => {})) {
 *  console.log('Is function')
 * }
 * ```
 */
const isFunction = <T extends (...args: unknown[]) => unknown>(
  input: unknown,
): input is T => input instanceof Function

// export
export default isFunction
