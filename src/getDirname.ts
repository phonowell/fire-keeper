import getName from './getName.js'

/**
 * Extract directory path from file path
 * @param input - File path string
 * @returns Directory path ('.' for current dir)
 * @example
 * getDirname('path/to/file.txt') // 'path/to'
 * getDirname('./config.json')   // '.'
 */
const getDirname = (input: string) => getName(input).dirname

export default getDirname
