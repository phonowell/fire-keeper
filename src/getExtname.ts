import getName from './getName'

/**
 * Get extname from path
 * @param input string
 * @returns string
 * @example
 * ```
 * const extname = getExtname('./src/file.txt')
 * //=> '.txt'
 * ```
 */
const getExtname = (input: string) => getName(input).extname

export default getExtname
