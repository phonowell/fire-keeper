import path from 'path'

export type GetNameResult = {
  basename: string
  dirname: string
  extname: string
  filename: string
}

/**
 * Parse path into components with cross-platform support
 * @param {string} input - File path
 * @returns {Object} Path components
 *   - basename: Name without extension ('file')
 *   - dirname: Directory path ('path/to')
 *   - extname: Extension with dot ('.txt')
 *   - filename: Full name ('file.txt')
 *
 * @example
 * getName('path/to/file.txt')
 * // => { basename: 'file', dirname: 'path/to',
 * //      extname: '.txt', filename: 'file.txt' }
 */

const getName = (input: string): GetNameResult => {
  if (!input) throw new Error(`getName/error: empty input`)

  const ipt = input.replace(/\\/g, '/')

  const extname = path.extname(ipt)
  const basename = path.basename(ipt, extname)
  const dirname = path.dirname(ipt)
  const filename = `${basename}${extname}`

  return { basename, dirname, extname, filename }
}

export default getName
