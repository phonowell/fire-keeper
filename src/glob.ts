import glob from 'fast-glob'

import normalizePath from './normalizePath'
import run from './run'
import toArray from './toArray'

import type { Options } from 'fast-glob'

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
 * List files or directories using glob patterns.
 * @param {string | string[] | ListSource} input - Glob pattern(s) to match files or directories
 * @param {Options} [options] - Additional options for glob matching
 * @returns {Promise<ListSource>} A promise that resolves to an array of matched paths
 * @example
 * ```typescript
 * // Basic usage with single pattern
 * const list = await glob('*.txt');
 * console.log(list);
 * //=> ['a.txt', 'b.txt']
 *
 * // Multiple patterns
 * const files = await glob(['src/*.ts', '!src/*.test.ts']);
 * //=> ['src/index.ts', 'src/utils/helper.ts']
 *
 * // With options
 * const docs = await glob('docs/*', {
 *   absolute: true,
 *   dot: true
 * });
 * //=> ['/absolute/path/docs/readme.md']
 *
 * // Empty or invalid input
 * const empty = await glob('');
 * //=> []
 * ```
 */
const main = async (
  input: string | string[] | ListSource,
  options?: Options,
): Promise<ListSource> => {
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
