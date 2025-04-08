import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import runConcurrent from './runConcurrent'
import toArray from './toArray'
import wrapList from './wrapList'

type Options = {
  concurrency?: number
}

/**
 * Create one or more directories recursively with proper permissions.
 * Supports concurrent creation and handles special characters in paths.
 *
 * @param {string | string[]} source - Directory path(s) to create
 *   - Single path or array of paths
 *   - Paths are normalized automatically
 *   - Supports Unicode and special characters (e.g., 'path/文件夹/test')
 *   - Deeply nested paths (tested up to 20 levels)
 *   - Empty paths are filtered out
 *
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum number of concurrent directory creations
 *
 * @returns {Promise<void>} Resolves when all directories are created with:
 *   - All parent directories created as needed
 *   - Appropriate permissions (rwx for owner on Unix-like systems)
 *
 * @throws {Error} When:
 *   - All provided paths are empty or invalid
 *   - Directory creation fails due to permissions
 *   - Path contains invalid characters (platform-specific)
 *   - Path length exceeds system limits
 *
 * Platform Notes:
 * - Windows: Rejects paths with invalid characters (<>:"|?*)
 * - Unix-like: Sets 0700 (rwx) permissions for owner by default
 *
 * @example
 * ```typescript
 * // Single directory with nested structure
 * await mkdir('path/to/deep/nested/dir')
 *
 * // Multiple directories concurrently
 * await mkdir([
 *   'path/to/dir1',
 *   'path/to/dir2',
 *   'path/with/特殊字符'
 * ])
 *
 * // Control concurrency for many directories
 * await mkdir(manyPaths, { concurrency: 3 })
 *
 * // Normalized paths
 * await mkdir('./path/../actual/dir')  // Creates 'actual/dir'
 *
 * // Handles empty or invalid paths
 * await mkdir(['valid/path', '', ' ']) // Creates only valid path
 *
 * // Error handling for invalid characters (Windows)
 * try {
 *   await mkdir('path/with/invalid?/chars')
 * } catch (error) {
 *   console.error('Invalid path:', error)
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
    patterns.map((pattern) => () => fse.ensureDir(pattern)),
  )

  echo('mkdir', `created ${wrapList(source)}`)
}

export default mkdir
