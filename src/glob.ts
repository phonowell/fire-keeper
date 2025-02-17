import glob, { Options } from 'fast-glob'

import normalizePath from './normalizePath'
import toArray from './toArray'
import run from './run'

type ListSource = string[] & {
  __IS_LISTED_AS_SOURCE__: true
}

const EMPTY_RESULT: ListSource = run(() => {
  const result: ListSource = [] as unknown as ListSource
  result.__IS_LISTED_AS_SOURCE__ = true
  return result
})

const isListedAsSource = (
  input: string | string[] | ListSource,
): input is ListSource =>
  Array.isArray(input) && !!(input as ListSource).__IS_LISTED_AS_SOURCE__

/**
 * List files or directories.
 * @param input - The input.
 * @param options - The options.
 * @returns The list source.
 * @example
 * ```
 * const list = await glob('*.txt')
 * console.log(list)
 * //=> ['a.txt', 'b.txt']
 * ```
 */
const main = async (
  input: string | string[] | ListSource,
  options?: Options,
) => {
  if (isListedAsSource(input)) return input

  if (!input) return EMPTY_RESULT
  if (!input.length) return EMPTY_RESULT

  const patterns = toArray(input).map(normalizePath).filter(Boolean)

  const result = (await glob(patterns, {
    absolute: true,
    dot: true,
    ...options,
  })) as ListSource
  result.__IS_LISTED_AS_SOURCE__ = true

  return result
}

export default main
