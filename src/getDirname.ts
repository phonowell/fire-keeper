import getName from './getName'

/**
 * Get directory path from a file path
 * @param {string} input - File path
 * @returns {string} Directory path ('.' for current directory)
 *
 * @example
 * // Basic paths
 * getDirname('path/to/file.txt') // 'path/to'
 * getDirname('./config.json') // '.'
 *
 * // Cross-platform support
 * getDirname('C:\\path\\file.txt') // 'C:/path'
 */
const getDirname = (input: string) => getName(input).dirname

export default getDirname
