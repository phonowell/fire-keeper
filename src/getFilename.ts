import getName from './getName.js'

/**
 * Extract full filename with extension from path
 * @param input - File path string
 * @returns Complete filename with extension
 * @example
 * getFilename('path/to/file.txt') // 'file.txt'
 * getFilename('.gitignore')       // '.gitignore'
 */
const getFilename = (input: string) => getName(input).filename

export default getFilename
