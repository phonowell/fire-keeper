/**
 * Convert input to string.
 * @param input The input.
 * @returns The string.
 * @example
 * ```
 * toString({ key: 'value' })
 * //=> '{"key":"value"}'
 * toString([1, 2, 3])
 * //=> '[1,2,3]'
 * toString('hello')
 * //=> 'hello'
 * ```
 */
const toString = <R extends string>(input: unknown) => {
  // string
  if (typeof input === 'string') return input as R

  // array
  if (input instanceof Array) return JSON.stringify(input) as R

  // object
  if (typeof input === 'object') return JSON.stringify(input) as R

  // others
  return String(input) as R
}

// export
export default toString
