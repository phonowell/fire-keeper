import path from 'path'

export type GetNameResult = {
  basename: string
  dirname: string
  extname: string
  filename: string
}

/**
 * Parse file path into named components
 * @param input - File path to parse
 * @returns Object with basename, dirname, extname, filename
 * @example
 * getName('path/to/file.txt')
 * // => { basename: 'file', dirname: 'path/to', extname: '.txt', filename: 'file.txt' }
 */

const getName = (input: string): GetNameResult => {
  if (!input) throw new Error(`getName/error: empty input`)

  const ipt = input.replace(/\\/g, '/')

  const extname = path.extname(ipt)
  const basename = path.basename(ipt, extname)
  let dirname = path.dirname(ipt)
  const filename = `${basename}${extname}`

  // Special handling for edge cases to match expected behavior

  // Handle UNC paths: //server/share/file.txt -> //server/share/
  if (ipt.startsWith('//') && dirname.match(/^\/\/[^/]+\/[^/]+$/))
    dirname = `${dirname}/`

  return { basename, dirname, extname, filename }
}

export default getName
