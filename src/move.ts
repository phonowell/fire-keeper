import copy from './copy'
import remove from './remove'

type Dirname = string | ((dirname: string) => string | Promise<string>)

type Options = {
  concurrency?: number
}

/**
 * Move files or directories.
 * @param {string | string[]} source - The source file/directory path or array of paths to move
 * @param {string | Function} target - The target directory or a function that returns the target path
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum number of concurrent operations
 * @returns {Promise<void>} Promise that resolves when all moves are complete
 * @throws {Error} If source doesn't exist or target is invalid
 * @example
 * ```typescript
 * // Move a single file
 * await move('file.txt', 'backup');
 *
 * // Move multiple files
 * await move(['file1.txt', 'file2.txt'], 'backup');
 *
 * // Using a function to generate target path
 * await move('file.txt', name => `backup/${name}`);
 *
 * // With custom concurrency
 * await move(['file1.txt', 'file2.txt'], 'backup', {
 *   concurrency: 2
 * });
 *
 * // Error handling
 * try {
 *   await move('nonexistent.txt', 'backup');
 * } catch (error) {
 *   console.error('Move failed:', error);
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
