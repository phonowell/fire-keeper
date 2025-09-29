import getName from './getName.js'

/**
 * Extract file extension from path
 * @param input - File path string
 * @returns Extension with dot or empty string
 * @example
 * getExtname('file.txt')     // '.txt'
 * getExtname('no-extension') // ''
 */
const getExtname = (input: string) => getName(input).extname

export default getExtname
