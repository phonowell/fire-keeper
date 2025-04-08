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
 * Includes smart caching through ListSource type marking and path normalization.
 *
 * @param {string | string[] | ListSource} source - Input to process:
 *   - Glob pattern (e.g., 'src/*.js')
 *   - Array of patterns with exclusions
 *   - Previously returned ListSource (returned as-is)
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.absolute=false] - Return absolute paths instead of relative
 * @param {boolean} [options.dot=true] - Include dotfiles (files starting with .)
 * @param {number} [options.deep=Infinity] - Maximum directory depth to traverse
 * @param {boolean} [options.onlyFiles=true] - Only return files (no directories)
 * @param {boolean} [options.onlyDirectories=false] - Only return directories (no files)
 * @returns {Promise<string[] & { __IS_LISTED_AS_SOURCE__: true }>} Array of matching paths
 *
 * @example
 * // Basic file matching with exclusions
 * const sources = await glob(['src/*.ts', '!src/*.test.ts'])
 *
 * // Directory matching with depth limit
 * const dirs = await glob('packages/*', { onlyDirectories: true, deep: 1 })
 *
 * // Special characters and Unicode
 * const specialFiles = await glob([
 *   'src/特殊文件.txt',
 *   'data/file!@#.txt',
 *   'path with spaces/*.js'
 * ])
 *
 * // Path normalization handled automatically
 * const normalized = await glob('./dir1/../dir2/*.ts')
 *
 * // Smart caching with ListSource
 * const files = await glob('src/*.ts')
 * const sameFiles = await glob(files)  // Returns cached result
 *
 * // Empty input cases all return empty ListSource
 * const empty1 = await glob('')
 * const empty2 = await glob([])
 * const empty3 = await glob([''])
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
