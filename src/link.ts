import fse from 'fs-extra'

import echo from './echo'
import glob from './glob'
import normalizePath from './normalizePath'

/**
 * Creates a symbolic link from source to target location.
 * Supports glob patterns for source path and handles path normalization.
 *
 * @param {string} source - The source file or directory path to create a link from.
 *   - Supports glob patterns (e.g., 'src/*.txt')
 *   - If multiple files match, uses the first match
 *   - Path is normalized (e.g., './foo/../bar' → 'bar')
 *
 * @param {string} target - The target path where the symbolic link will be created.
 *   - Must be a single path (no glob patterns)
 *   - Path is normalized automatically
 *   - Supports Unicode and special characters
 *
 * @returns {Promise<void>} Resolves silently when:
 *   - Link is created successfully
 *   - Source glob pattern has no matches
 *   - Target path is empty
 *
 * @throws {Error} When:
 *   - Source path exists but is inaccessible
 *   - Target path is invalid or inaccessible
 *   - Filesystem operations fail
 *   - Insufficient permissions
 *
 * Platform Notes:
 * - On Windows: Directory symlinks require elevated permissions
 * - On Unix-like systems: Both file and directory symlinks work normally
 *
 * @example
 * ```typescript
 * // Basic file symlink
 * await link('config.json', 'config.link.json')
 *
 * // Directory symlink (Unix-like systems)
 * await link('source-dir/', 'link-dir/')
 *
 * // Using glob pattern
 * await link('configs/*.default.json', 'config.json')
 * //=> Links the first matching .default.json file
 *
 * // Normalized paths
 * await link('./config/../settings.json', './current/config.json')
 *
 * // Special characters
 * await link('配置文件.txt', 'link-配置.txt')
 *
 * // Error handling
 * try {
 *   await link('src/', 'link/')  // May require elevated permissions on Windows
 * } catch (error) {
 *   console.error('Failed to create symlink:', error)
 * }
 * ```
 */
const link = async (source: string, target: string): Promise<void> => {
  const sourcePaths = await glob(source, {
    onlyFiles: false,
  })
  if (!sourcePaths[0]) return

  const normalizedTarget = normalizePath(target)
  if (!normalizedTarget.length) return

  await fse.ensureSymlink(sourcePaths[0], normalizedTarget)

  echo('link', `linked '${source}' to '${target}'`)
}

export default link
