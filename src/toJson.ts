import { isObject } from 'lodash'

import isArray from './isArray'

type Result<R, Input> = R extends undefined
  ? Input extends string | Uint8Array
    ? Record<string, unknown> | unknown[]
    : Input extends unknown[] | Record<string, unknown>
      ? Input
      : never
  : R

/**
 * Convert input to JSON.
 * @param input Input to convert.
 * @returns The JSON.
 * @example
 * ```
 * const json = toJson('{"key": "value"}')
 * console.log(json)
 * //=> { key: 'value' }
 * ```
 */
const toJSON = <R = undefined, I = unknown>(input: I) => {
  if (typeof input === 'string') return JSON.parse(input) as Result<R, I>
  if (isArray(input)) return input as Result<R, I>
  if (input instanceof Uint8Array)
    return JSON.parse(input.toString()) as Result<R, I>
  if (isObject(input)) return input as Result<R, I>
  throw new Error(`toJSON/error: invalid type '${typeof input}'`)
}

// export
export default toJSON
