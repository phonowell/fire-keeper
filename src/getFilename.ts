import getName from './getName'

/**
 * Extracts the filename (with extension) from a file path.
 * Handles cross-platform paths, URLs, and various special cases.
 *
 * @param {string} input - The file path to process
 * @returns {string} The filename including extension
 * @throws {Error} If input is empty
 *
 * @example
 * // Basic usage
 * getFilename('path/to/file.txt')         // 'file.txt'
 * getFilename('C:\\path\\file.txt')       // 'file.txt'
 *
 * // URLs and special protocols
 * getFilename('http://site.com/file.txt') // 'file.txt'
 * getFilename('file:///C:/path/doc.pdf')  // 'doc.pdf'
 *
 * // Special characters and Unicode
 * getFilename('path/文件名.txt')          // '文件名.txt'
 * getFilename('emoji-🌟.txt')             // 'emoji-🌟.txt'
 * getFilename('my file！@#$.pdf')         // 'my file！@#$.pdf'
 *
 * // Directory paths
 * getFilename('path/to/dir/')             // 'dir'
 * getFilename('.')                        // '.'
 * getFilename('..')                       // '..'
 *
 * // Multiple extensions and dots
 * getFilename('script.test.js.map')       // 'script.test.js.map'
 * getFilename('file.with.many.dots.txt')  // 'file.with.many.dots.txt'
 *
 * // Hidden files and no extensions
 * getFilename('.gitignore')               // '.gitignore'
 * getFilename('Makefile')                 // 'Makefile'
 */
const getFilename = (input: string) => getName(input).filename

export default getFilename
