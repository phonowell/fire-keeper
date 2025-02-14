import os from 'os'

/**
 * Get the home directory.
 * @returns The home directory.
 * @example
 * ```
 * home()
 * //=> '/home/runner'
 * ```
 */
const home = () => os.homedir().replace(/\\/g, '/')

export default home
