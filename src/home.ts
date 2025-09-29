import os from 'os'

/**
 * Get normalized user home directory path
 * @returns Cross-platform home directory with forward slashes
 * @example
 * home() // '/Users/username' (macOS) or 'C:/Users/username' (Windows)
 */
const home = () => os.homedir().replace(/\\/g, '/')

export default home
