import copy from './copy'
import remove from './remove'

type Dirname = string | ((dirname: string) => string | Promise<string>)

type Options = {
  concurrency?: number
}

/**
 * Move files or directories while preserving their structure.
 * Uses copy-then-remove strategy for reliability.
 *
 * @param {string | string[]} source - Source path(s) to move
 *   - Single file/directory path or array of paths
 *   - Paths are normalized (e.g., './foo/../bar' → 'bar')
 *   - Supports glob patterns for directory moves
 *   - Non-existent sources are silently skipped
 *
 * @param {string | Function} target - Target directory or path generator
 *   - String: Direct target directory path
 *   - Function: (sourceName: string) => string | Promise<string>
 *   - Paths are normalized automatically
 *   - Directories are created as needed
 *
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum concurrent operations
 *
 * @returns {Promise<void>} Resolves when all moves complete:
 *   - Source files/directories are removed
 *   - Target files/directories exist with identical content
 *   - Directory structure is preserved
 *
 * @throws {Error} When:
 *   - Target path generation fails
 *   - Write permission denied
 *   - Disk space insufficient
 *
 * @example
 * ```typescript
 * // Basic file move
 * await move('config.json', 'backup/')
 *
 * // Move multiple files
 * await move(['file1.txt', 'file2.txt'], 'archive/')
 *
 * // Move with glob pattern preserving structure
 * await move('src/**\/*.ts', 'backup/src/')
 *
 * // Dynamic target path with sync function
 * await move('file.txt', name => `backup/${Date.now()}_${name}`)
 *
 * // Dynamic target path with async function
 * await move('data.json', async name => {
 *   await someAsyncOperation()
 *   return `processed/${name}`
 * })
 *
 * // Move to existing directory
 * await move('newFile.txt', 'existing/dir/') // Won't affect other files
 *
 * // Control concurrency for many files
 * await move(manyFiles, 'dest/', { concurrency: 3 })
 *
 * // Error handling
 * try {
 *   await move('huge.dat', '/limited-space/')
 * } catch (error) {
 *   console.error('Move failed:', error)
 * }
 * ```
 */
const move = async (
  source: string | string[],
  target: Dirname,
  { concurrency = 5 }: Options = {},
) => {
  await copy(source, target, {
    concurrency,
  })
  await remove(source, {
    concurrency,
  })
}

export default move
