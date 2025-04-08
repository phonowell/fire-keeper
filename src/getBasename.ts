import getName from './getName'

/**
 * Extracts the basename (filename without extension) from a file path.
 * Handles special cases like multiple extensions, hidden files, and various path formats.
 * Compatible with Unix, Windows paths, and URL-like paths.
 *
 * @param {string} input - The file path to process
 * @returns {string} The basename of the file without extension
 * @throws {Error} If input is empty
 *
 * @example
 * // Basic usage
 * getBasename('path/to/file.txt')      // 'file'
 * getBasename('script.test.ts')        // 'script.test'
 *
 * // Hidden and special files
 * getBasename('.gitignore')            // '.gitignore'
 * getBasename('path/to/.local')        // '.local'
 *
 * // Special characters and spaces
 * getBasename('file with spaces.txt')  // 'file with spaces'
 * getBasename('data!@#.json')          // 'data!@#'
 *
 * // Unicode support
 * getBasename('文件.txt')              // '文件'
 * getBasename('ファイル.doc')          // 'ファイル'
 *
 * // Windows paths
 * getBasename('C:\\path\\file.txt')    // 'file'
 * getBasename('\\\\server\\doc.pdf')   // 'doc'
 *
 * // URL-like paths
 * getBasename('http://site.com/f.txt') // 'f'
 *
 * // Edge cases
 * getBasename('.')                     // '.'
 * getBasename('..')                    // '..'
 * getBasename('/')                     // ''
 */
const getBasename = (input: string) => getName(input).basename

export default getBasename
