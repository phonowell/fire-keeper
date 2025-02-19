import echo from './echo'
import flatten from './flatten'
import normalizePath from './normalizePath'
import read from './read'
import stat from './stat'

/**
 * Check if the content of multiple files or paths are identical.
 * @param {...(string | string[])} args - The paths to compare. Can be single paths or arrays of paths
 * @returns {Promise<boolean>} A promise that resolves to:
 *   - `true` if all files have identical content and size
 *   - `false` if:
 *     - Less than 2 paths provided
 *     - Any path doesn't exist
 *     - Files have zero size
 *     - Files have different sizes
 *     - Files have different content
 * @example
 * ```typescript
 * // Basic comparison
 * const same = await isSame('file1.txt', 'file2.txt');
 * //=> true if files have identical content
 *
 * // Multiple files with array
 * const allSame = await isSame(['config1.json', 'config2.json', 'config3.json']);
 * //=> true if all files are identical
 *
 * // Mixed parameter types
 * const mixed = await isSame('original.txt', ['copy1.txt', 'copy2.txt']);
 * //=> true if all files match
 *
 * // Failure cases
 * const single = await isSame('file.txt');
 * //=> false (needs at least 2 files)
 *
 * const nonExistent = await isSame('exists.txt', 'missing.txt');
 * //=> false (missing file)
 *
 * const diffSize = await isSame('small.txt', 'large.txt');
 * //=> false (different file sizes)
 *
 * const diffContent = await isSame('original.txt', 'modified.txt');
 * //=> false (different content)
 * ```
 */
const isSame = async (...args: (string | string[])[]): Promise<boolean> => {
  const originalGroup = flatten(args)
  const group = originalGroup.map(normalizePath).filter(Boolean)
  if (group.length < 2) return false
  if (group.length !== originalGroup.length) return false

  // 检查文件大小
  let cacheSize = 0
  for (const source of group) {
    const stats = await stat(source)
    if (!stats) return false

    const { size } = stats
    if (!size) return false // 如果文件大小为 0，则直接返回 false

    if (!cacheSize) {
      cacheSize = size
      continue
    }

    if (size !== cacheSize) return false
  }

  // 检查文件内容
  let cacheCont: Buffer | undefined = undefined
  for (const source of group) {
    const cont = await echo.freeze(
      read(source, {
        raw: true,
      }),
    )
    if (!cont) return false // 如果文件内容为空，则直接返回 false

    if (!cacheCont) {
      cacheCont = cont
      continue
    }

    if (Buffer.compare(cont, cacheCont) !== 0) return false
  }

  return true
}

export default isSame
