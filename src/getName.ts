import path from 'path'

/**
 * Extracts all path components from a file path string.
 * Normalizes path separators and handles cross-platform paths.
 *
 * @param {string} input - The file path to process
 * @returns {Object} Path components
 *   - basename: Name without extension (e.g., 'file')
 *   - dirname: Directory path (e.g., 'path/to')
 *   - extname: Extension with dot (e.g., '.txt')
 *   - filename: Full name with extension (e.g., 'file.txt')
 * @throws {Error} If input is empty
 *
 * @example
 * // Basic path decomposition
 * getName('path/to/file.txt')
 * // => {
 * //   basename: 'file',
 * //   dirname: 'path/to',
 * //   extname: '.txt',
 * //   filename: 'file.txt'
 * // }
 *
 * // Windows path (separators normalized)
 * getName('C:\\Users\\file.txt')
 * // => {
 * //   basename: 'file',
 * //   dirname: 'C:/Users',
 * //   extname: '.txt',
 * //   filename: 'file.txt'
 * // }
 *
 * // Complex path with dots
 * getName('src/test.spec.tsx')
 * // => {
 * //   basename: 'test.spec',
 * //   dirname: 'src',
 * //   extname: '.tsx',
 * //   filename: 'test.spec.tsx'
 * // }
 */
const getName = (input: string) => {
  if (!input) throw new Error(`getName/error: empty input`)

  const ipt = input.replace(/\\/g, '/')

  const extname = path.extname(ipt)
  const basename = path.basename(ipt, extname)
  const dirname = path.dirname(ipt)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

export default getName
