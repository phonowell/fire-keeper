import getName from './getName'

/**
 * Extracts the directory name from a file path.
 * @param {string} input - The file path to process
 * @returns {string} The directory name component of the path
 * @example
 * ```typescript
 * // Basic usage with relative path
 * const dirname = getDirname('./src/file.txt');
 * //=> 'src'
 *
 * // With absolute path
 * const root = getDirname('/usr/local/bin/app');
 * //=> '/usr/local/bin'
 *
 * // With nested directories
 * const nested = getDirname('project/src/components/Button.tsx');
 * //=> 'project/src/components'
 *
 * // Current directory
 * const current = getDirname('./config.json');
 * //=> '.'
 * ```
 */
const getDirname = (input: string) => getName(input).dirname

export default getDirname
