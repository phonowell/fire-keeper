import getName from './getName'

/**
 * Get filename from path
 * @param input string
 * @returns string
 * @example
 * ```
 * const filename = getFilename('./src/file.txt')
 * //=> 'file.txt'
 * ```
 */
const getFilename = (input: string) => getName(input).filename

export default getFilename
