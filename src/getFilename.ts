import getName from './getName'

/**
 * Extracts the filename (with extension) from a file path.
 * @param {string} input - The file path to process
 * @returns {string} The filename including extension
 * @example
 * ```typescript
 * // Basic usage
 * const filename = getFilename('./src/file.txt');
 * //=> 'file.txt'
 *
 * // With multiple extensions
 * const test = getFilename('path/to/script.test.ts');
 * //=> 'script.test.ts'
 *
 * // Hidden file
 * const hidden = getFilename('/path/.gitignore');
 * //=> '.gitignore'
 *
 * // File without extension
 * const noExt = getFilename('docs/README');
 * //=> 'README'
 * ```
 */
const getFilename = (input: string) => getName(input).filename

export default getFilename
