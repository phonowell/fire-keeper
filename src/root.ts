/**
 * Gets the normalized absolute path of the current working directory
 * @returns {string} Normalized absolute path using forward slashes
 *
 * @example Current directory path
 * ```ts
 * root()
 * //=> '/Users/project/src'
 * ```
 *
 * @example Root directory handling
 * ```ts
 * // When cwd is root
 * root()
 * //=> '/'
 * ```
 *
 * @example Unicode and spaces support
 * ```ts
 * // With special characters
 * root()
 * //=> '/Users/项目/测试 空格/src'
 * ```
 *
 * Features:
 * - Forward slash normalization
 * - Unicode path support
 * - Space handling
 * - Root path detection
 * - Path validation
 *
 * Validation:
 * - No empty paths
 * - No relative components (. or ..)
 * - No illegal characters (<>:"|?*)
 * - Must be absolute
 *
 * @throws {Error} 'Invalid path: path is empty' - If path resolves to empty
 * @throws {Error} 'Invalid path: contains forbidden characters' - If path has illegal chars
 * @throws {Error} 'Invalid path: contains relative path components' - If path has . or ..
 */
const root = () => {
  const path = process.cwd().replace(/\\/g, '/')

  // Special case for root path
  if (path === '/') return path

  // Split and validate path components
  const parts = path.split('/').filter(Boolean)

  // Validate path structure
  if (parts.length < 1) throw new Error('Invalid path: path is empty')

  // Validate characters
  if (parts.some((p) => /[<>:"|?*]/.test(p)))
    throw new Error('Invalid path: contains forbidden characters')

  // Check for illegal path patterns
  if (parts.some((p) => p === '.' || p === '..'))
    throw new Error('Invalid path: contains relative path components')

  return `/${parts.join('/')}`
}

export default root
