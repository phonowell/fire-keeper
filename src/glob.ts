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
 * Find files and directories using glob patterns with enhanced options and type safety.
 * Returns paths matching the specified patterns while respecting configuration options.
 * The result is marked with a special flag to indicate it's a source list.
 *
 * @param {string | string[]} source - Glob pattern(s) to match. Can be:
 *   - Single pattern (e.g., 'src/*.js')
 *   - Array of patterns
 *   - File/directory path(s)
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.absolute=false] - Return absolute paths instead of relative
 * @param {boolean} [options.dot=true] - Include dotfiles (files starting with .)
 * @param {number} [options.deep=Infinity] - Maximum directory depth to traverse
 * @param {boolean} [options.onlyFiles=true] - Only return files (no directories)
 * @param {boolean} [options.onlyDirectories=false] - Only return directories (no files)
 * @returns {Promise<string[] & { __IS_LISTED_AS_SOURCE__: true }>} Array of matching paths
 *
 * @example
 * // Find all JavaScript files
 * const jsFiles = await glob('src/*.js')
 *
 * // Multiple patterns
 * const sources = await glob([
 *   'src/*.ts',
 *   'src/*.tsx',
 *   '!src/*.test.*'  // Exclude test files
 * ])
 *
 * // Find directories only
 * const dirs = await glob('src/+([a-z])', {
 *   onlyDirectories: true
 * })
 *
 * // Shallow search with absolute paths
 * const shallow = await glob('packages/+([a-z])', {
 *   absolute: true,
 *   deep: 1
 * })
 *
 * // Find all hidden files
 * const dotFiles = await glob('.*', {
 *   dot: true,
 *   onlyFiles: true
 * })
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
