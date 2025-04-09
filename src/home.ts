import os from 'os'

/**
 * Get normalized user home directory path
 * @returns {string} Absolute home path with forward slashes
 *
 * @example
 * // Unix-like systems
 * home() //=> '/Users/username'
 *
 * // Windows (normalized)
 * home() //=> 'C:/Users/username'
 */
const home = () => os.homedir().replace(/\\/g, '/')

export default home
