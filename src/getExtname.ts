import getName from './getName'

// function

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

// export
export default getExtname
