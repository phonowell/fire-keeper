import getName from './getName'

/**
 * Extracts the file extension from a path string.
 * @param {string} input - The file path to process
 * @returns {string} The file extension including the leading dot, or empty string if no extension
 * @example
 * ```typescript
 * // Basic usage
 * const extname = getExtname('./src/file.txt');
 * //=> '.txt'
 *
 * // With multiple extensions
 * const test = getExtname('script.test.ts');
 * //=> '.ts'
 *
 * // No extension
 * const none = getExtname('README');
 * //=> ''
 *
 * // Hidden file
 * const hidden = getExtname('.gitignore');
 * //=> ''
 * ```
 */
const getExtname = (input: string) => getName(input).extname

export default getExtname
