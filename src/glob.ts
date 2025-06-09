import glob from 'fast-glob'

import normalizePath from './normalizePath.js'
import run from './run.js'
import toArray from './toArray.js'

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
 * Find files using glob patterns with smart caching
 * @param {string | string[] | ListSource} source - Pattern(s) or cached result
 * @param {Object} [options] - Search options
 * @param {boolean} [options.absolute] - Return absolute paths
 * @param {boolean} [options.dot] - Include dotfiles
 * @param {number} [options.deep] - Max directory depth
 * @param {boolean} [options.onlyFiles] - Only match files
 * @param {boolean} [options.onlyDirectories] - Only match directories
 * @returns {Promise<string[]>} Matching paths
 *
 * @example
 * // Basic matching with exclusions
 * glob(['src/*.ts', '!src/*.test.ts'])
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
