import getName from './getName'

// function

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

// export
export default getBasename
