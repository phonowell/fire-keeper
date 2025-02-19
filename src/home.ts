import os from 'os'

/**
 * Get the user's home directory with normalized forward slashes.
 * @returns {string} The home directory path with forward slashes
 * @example
 * ```typescript
 * // On macOS/Linux
 * home();
 * //=> '/Users/username'
 *
 * // On Windows (automatically converted to forward slashes)
 * home();
 * //=> 'C:/Users/username'
 *
 * // Usage example
 * const configPath = `${home()}/.config/settings.json`;
 * //=> '/Users/username/.config/settings.json'
 * ```
 */
const home = () => os.homedir().replace(/\\/g, '/')

export default home
