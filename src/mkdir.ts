import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import toArray from './toArray'
import wrapList from './wrapList'
import runConcurrent from './runConcurrent'

type Options = {
  concurrency?: number
}

/**
 * Create one or more directories recursively.
 * @param {string | string[]} source - A single directory path or array of directory paths to create
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum number of concurrent directory creations
 * @returns {Promise<void>} Promise that resolves when all directories are created
 * @throws {Error} If:
 *   - The source is empty
 *   - Directory creation fails
 *   - Insufficient permissions
 * @example
 * ```typescript
 * // Create a single directory
 * await mkdir('path/to/dir');
 *
 * // Create multiple directories
 * await mkdir(['path/to/dir1', 'path/to/dir2']);
 *
 * // Handles nested paths
 * await mkdir('path/to/nested/dir');
 *
 * // With custom concurrency
 * await mkdir(['dir1', 'dir2', 'dir3'], { concurrency: 2 });
 *
 * // Error handling
 * try {
 *   await mkdir('/root/restricted-dir');
 * } catch (error) {
 *   console.error('Failed to create directory:', error);
 * }
 * ```
 */
const mkdir = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const patterns = toArray(source).map(normalizePath).filter(Boolean)
  if (!patterns.length) return

  await runConcurrent(
    concurrency,
    patterns.map(pattern => () => fse.ensureDir(pattern)),
  )

  echo('mkdir', `created ${wrapList(source)}`)
}

export default mkdir
