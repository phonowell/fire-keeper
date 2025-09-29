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
 * Find files using glob patterns with caching support
 * @param input - Glob pattern(s) or cached result
 * @param options - Search options (absolute, dot, deep, onlyFiles, etc.)
 * @returns Promise resolving to array of matching file paths
 * @example
 * glob('src/*.ts')                      // All .ts files in src/
 * glob(['**\/*.js', '!node_modules'])   // JS files excluding node_modules
 */
const main = async (
  input: string | string[] | ListSource,
  options?: Options,
): Promise<ListSource> => {
  if (isListedAsSource(input)) return input
  if (!input || input.length === 0) return EMPTY_RESULT

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
