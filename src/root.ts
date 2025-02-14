/**
 * Get the root path of the project
 * @returns - The root path of the project
 * @example
 * ```
 * root()
 * //=> '/Users/johndoe/project'
 * ```
 */
const root = () => process.cwd().replace(/\\/g, '/')

export default root
