import getName from './getName.js'

/**
 * Get file extension from a path
 * @param {string} input - File path
 * @returns {string} Extension with dot or empty string
 *
 * @example
 * // Basic usage
 * getExtname('file.txt') // '.txt'
 * getExtname('no-extension') // ''
 *
 * // Special cases
 * getExtname('.gitignore') // ''
 * getExtname('bundle.min.js') // '.js'
 */
const getExtname = (input: string) => getName(input).extname

export default getExtname
