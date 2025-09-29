import getName from './getName.js'

/**
 * Extract filename without extension from path
 * @param input - File path string
 * @returns Basename without extension
 * @example
 * getBasename('path/file.txt') // 'file'
 * getBasename('.gitignore')    // '.gitignore'
 */
const getBasename = (input: string) => getName(input).basename

export default getBasename
