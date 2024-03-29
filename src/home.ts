import os from 'os'

// function

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

// export
export default home
