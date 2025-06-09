import getName from './getName.js'

/**
 * Get filename with extension from a path
 * @param {string} input - File path
 * @returns {string} Full filename with extension
 *
 * @example
 * // Basic paths
 * getFilename('path/to/file.txt') // 'file.txt'
 * getFilename('script.test.js') // 'script.test.js'
 *
 * // Special paths
 * getFilename('path/to/dir/') // 'dir'
 * getFilename('.gitignore') // '.gitignore'
 */
const getFilename = (input: string) => getName(input).filename

export default getFilename
