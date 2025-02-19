import getName from './getName'

/**
 * Extracts the basename (filename without extension) from a file path.
 * @param {string} input - The file path to process
 * @returns {string} The basename of the file without extension
 * @example
 * ```typescript
 * // Basic usage
 * const basename = getBasename('./src/file.txt');
 * //=> 'file'
 *
 * // With multiple extensions
 * const name = getBasename('path/to/script.test.ts');
 * //=> 'script.test'
 *
 * // With no extension
 * const simple = getBasename('documents/notes');
 * //=> 'notes'
 *
 * // With absolute path
 * const abs = getBasename('/usr/local/file.md');
 * //=> 'file'
 * ```
 */
const getBasename = (input: string) => getName(input).basename

export default getBasename
