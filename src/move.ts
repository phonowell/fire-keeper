import copy from './copy.js'
import remove from './remove.js'

type Dirname = string | ((dirname: string) => string | Promise<string>)

type Options = {
  concurrency?: number
}

/**
 * Move files or directories with copy-then-remove strategy.
 *
 * @param {string | string[]} source - Source path(s) to move
 * @param {string | Function} target - Target directory or path generator function
 * @param {Object} [options] - Configuration options
 * @param {number} [options.concurrency=5] - Maximum concurrent operations
 *
 * @returns {Promise<void>} Resolves when moves complete
 *
 * @throws {Error} When target generation fails or disk operations fail
 *
 * @example
 * ```typescript
 * await move('config.json', 'backup/')
 * await move(['file1.txt', 'file2.txt'], 'archive/')
 * await move('src/**\/*.ts', 'backup/src/')
 * await move('file.txt', name => `backup/${Date.now()}_${name}`)
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
