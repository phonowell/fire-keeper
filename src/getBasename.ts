import getName from './getName.js'

/**
 * Get filename without extension from a path
 * @param {string} input - File path
 * @returns {string} Basename without extension
 *
 * @example
 * // Regular paths
 * getBasename('path/to/file.txt') // 'file'
 * getBasename('script.test.ts') // 'script.test'
 *
 * // Special cases
 * getBasename('.gitignore') // '.gitignore'
 */
const getBasename = (input: string) => getName(input).basename

export default getBasename
