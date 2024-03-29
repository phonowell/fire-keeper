import isFunction from './isFunction'

// function

/**
 * Check if the input is an async function.
 *
 * @param input The value to check.
 * @returns Returns the result of the check.
 * @example
 * ```
 * const isAsync = isAsyncFunction(async () => {})
 * //=> true
 * ```
 */
const isAsyncFunction = <T extends (...args: unknown[]) => Promise<unknown>>(
  input: unknown,
): input is T => {
  if (!isFunction(input)) return false

  const type = Object.prototype.toString
    .call(input)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase()

  return type === 'asyncfunction'
}

// export
export default isAsyncFunction
