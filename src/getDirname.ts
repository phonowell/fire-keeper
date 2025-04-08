import getName from './getName'

/**
 * Extracts the directory name from a file path.
 * Normalizes paths across different formats and handles special cases.
 *
 * @param {string} input - The file path to process
 * @returns {string} The directory name component of the path ('.' for current directory)
 * @throws {Error} If input is empty
 *
 * @example
 * // Basic usage
 * getDirname('path/to/file.txt')          // 'path/to'
 * getDirname('./config.json')             // '.'
 * getDirname('../config.json')            // '..'
 *
 * // Windows paths (automatically normalized)
 * getDirname('C:\\path\\to\\file.txt')    // 'C:/path/to'
 * getDirname('\\\\server\\share\\file')   // '//server/share'
 *
 * // URL-like paths
 * getDirname('http://site.com/file')      // 'http://site.com'
 * getDirname('file:///root/file')         // 'file:///root'
 *
 * // Special characters and Unicode
 * getDirname('path/with spaces/file')     // 'path/with spaces'
 * getDirname('文件夹/文件.txt')           // '文件夹'
 * getDirname('path/with/🌟/file')         // 'path/with/🌟'
 *
 * // Edge cases
 * getDirname('/')                         // '/'
 * getDirname('.')                         // '.'
 * getDirname('./')                        // '.'
 * getDirname('   ')                       // '.'
 */
const getDirname = (input: string) => getName(input).dirname

export default getDirname
