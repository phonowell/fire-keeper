import echo from './echo'
import flatten from './flatten'
import normalizePath from './normalizePath'
import read from './read'
import stat from './stat'

/**
 * Check if the content of multiple files or paths are identical.
 * All paths are automatically normalized before comparison.
 * Uses efficient buffer comparison for binary-safe content matching.
 *
 * @param {...(string | string[])} args - The paths to compare. Can be single paths or arrays of paths.
 *   - Accepts any combination of strings and arrays
 *   - Arrays are automatically flattened
 *   - Paths are normalized (e.g., './foo/../bar' → 'bar')
 *   - At least 2 valid paths required
 *
 * @returns {Promise<boolean>} A promise that resolves to:
 *   - `true` if all files have identical:
 *     - File size
 *     - Binary content (compared using Buffer)
 *   - `false` if:
 *     - Less than 2 valid paths provided
 *     - Empty arrays or invalid paths included
 *     - Any path doesn't exist
 *     - Files have zero size
 *     - Files have different sizes (checked before content)
 *     - Files have different content
 *
 * @example
 * ```typescript
 * // Basic comparison
 * await isSame('file1.txt', 'file2.txt')
 * //=> true if files match
 *
 * // Multiple comparison methods
 * await isSame(['config1.json', 'config2.json'], 'config3.json')
 * await isSame('master.txt', ['copy1.txt', 'copy2.txt'])
 * await isSame(['v1.txt'], 'v2.txt', ['v3.txt', 'v4.txt'])
 * //=> true if all files match
 *
 * // Path normalization
 * await isSame('./path/file.txt', './path/./other/../file.txt')
 * //=> true (paths normalize to same file)
 *
 * // Failure cases
 * await isSame('file.txt')                   //=> false (single file)
 * await isSame([])                           //=> false (empty input)
 * await isSame('real.txt', 'missing.txt')    //=> false (missing file)
 * await isSame('empty1.txt', 'empty2.txt')   //=> false (zero byte files)
 * await isSame('small.txt', 'large.txt')     //=> false (size mismatch)
 * await isSame('one.txt', '', 'two.txt')     //=> false (invalid path)
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
