import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import toArray from './toArray'
import wrapList from './wrapList'

/**
 * Create one or more directories recursively.
 * @param source A single directory path or array of directory paths to create
 * @throws {Error} If the source is empty or if directory creation fails
 * @returns Promise that resolves to true if all directories were created successfully
 * @example
 * ```typescript
 * // Create a single directory
 * await mkdir('path/to/dir')
 *
 * // Create multiple directories
 * await mkdir(['path/to/dir1', 'path/to/dir2'])
 *
 * // Handles nested paths
 * await mkdir('path/to/nested/dir')
 * ```
 */
const mkdir = async (source: string | string[]): Promise<boolean> => {
  const patterns = toArray(source).map(normalizePath).filter(Boolean)
  if (!patterns.length) return false

  for (const pattern of patterns) {
    await fse.ensureDir(pattern)
  }

  echo('file', `created ${wrapList(source)}`)
  return true
}

export default mkdir
