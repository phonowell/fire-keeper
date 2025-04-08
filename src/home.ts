import os from 'os'

/**
 * Get the user's home directory with normalized forward slashes. The path is guaranteed to:
 * - Be an absolute path
 * - Use forward slashes (/) regardless of platform
 * - Have no trailing slash
 * - Be consistent across multiple calls
 * - Follow platform-specific conventions (e.g., /Users/ on macOS, C:/Users/ on Windows)
 *
 * @returns {string} The normalized home directory path that:
 *   - On Unix-like systems: starts with / (e.g., '/home/username' or '/Users/username')
 *   - On Windows: starts with drive letter (e.g., 'C:/Users/username')
 *
 * @example
 * ```typescript
 * // On macOS/Linux
 * home()
 * //=> '/Users/username'
 *
 * // On Windows (automatically converted to forward slashes)
 * home()
 * //=> 'C:/Users/username'
 *
 * // Safe for path concatenation
 * const configPath = `${home()}/.config/settings.json`
 * //=> '/Users/username/.config/settings.json'
 *
 * // Always returns consistent path
 * home() === home() //=> true
 * ```
 */
const home = () => os.homedir().replace(/\\/g, '/')

export default home
