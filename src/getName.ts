import path from 'path'

/**
 * Get name from path
 * @param input string
 * @returns object
 * @example
 * ```
 * const name = getName('./src/file.txt')
 * //=> { basename: 'file', dirname: 'src', extname: '.txt', filename: 'file.txt' }
 * ```
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
