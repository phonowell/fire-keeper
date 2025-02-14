import getName from './getName'

/**
 * Get dirname from path
 * @param input string
 * @returns string
 * @example
 * ```
 * const dirname = getDirname('./src/file.txt')
 * //=> 'src'
 * ```
 */
const getDirname = (input: string) => getName(input).dirname

export default getDirname
