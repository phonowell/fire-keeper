import getName from './getName'

/**
 * Get basename from path
 * @param input string
 * @returns string
 * @example
 * ```
 * const basename = getBasename('./src/file.txt')
 * //=> 'file'
 * ```
 */
const getBasename = (input: string) => getName(input).basename

export default getBasename
