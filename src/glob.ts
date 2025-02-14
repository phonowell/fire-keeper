import glob, { Options } from 'fast-glob'

import normalizePath from './normalizePath'
import toArray from './toArray'

type ListSource = string[] & {
  __is_listed_as_source__: true
}

const isListedAsSource = (
  input: string | string[] | ListSource,
): input is ListSource =>
  input instanceof Array &&
  (input as ListSource & object).__is_listed_as_source__

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

  const result = (await glob(toArray(input).map(normalizePath), {
    absolute: true,
    suppressErrors: true,
    ...options,
  })) as ListSource
  result.__is_listed_as_source__ = true

  return result
}

export default main
