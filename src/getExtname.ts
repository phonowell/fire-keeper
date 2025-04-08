import getName from './getName'

/**
 * Extracts the file extension from a path string.
 * Preserves case sensitivity and handles special file formats.
 *
 * @param {string} input - The file path to process
 * @returns {string} The file extension including the leading dot, or empty string if no extension
 * @throws {Error} If input is empty
 *
 * @example
 * // Basic usage
 * getExtname('file.txt')              // '.txt'
 * getExtname('no-extension')          // ''
 *
 * // Case sensitivity preserved
 * getExtname('script.JS')             // '.JS'
 * getExtname('style.Css')            // '.Css'
 *
 * // Special formats
 * getExtname('types.d.ts')           // '.ts'
 * getExtname('bundle.min.js.map')    // '.map'
 * getExtname('test.spec.jsx')        // '.jsx'
 *
 * // Hidden files
 * getExtname('.gitignore')           // ''
 * getExtname('.env')                 // ''
 * getExtname('.env.local')           // '.local'
 *
 * // Paths with dots
 * getExtname('v1.2.3.txt')          // '.txt'
 * getExtname('path.with.dots.md')    // '.md'
 *
 * // Edge cases
 * getExtname('file.')                // '.'
 * getExtname('.')                    // ''
 * getExtname('..')                   // ''
 */
const getExtname = (input: string) => getName(input).extname

export default getExtname
