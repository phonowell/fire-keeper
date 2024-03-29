import $type from './getType'

// interface

type HasToString = {
  toString: () => string
}

// functions

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
  if (typeof input === 'string') return input as R

  if (input instanceof Array) return JSON.stringify(input) as R

  if ($type(input) === 'object') return JSON.stringify(input) as R
  if (validateAsHasToString(input)) return input.toString() as R
  return String(input) as R
}

const validateAsHasToString = (input: unknown): input is HasToString =>
  typeof (input as HasToString | undefined)?.toString === 'function'

// export
export default toString
