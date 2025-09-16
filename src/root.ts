/**
 * Gets the normalized absolute path of the current working directory
 * @returns {string} Normalized absolute path using forward slashes
 *
 * @example
 * ```ts
 * root()
 * //=> '/Users/project/src' (on Unix-like systems)
 *
 * root()
 * //=> 'C:/Users/project/src' (on Windows)
 * ```
 *
 * @throws {Error} For invalid paths (empty, containing forbidden characters, or relative components)
 */
const root = () => {
  const cwd = process.cwd()
  if (!cwd) throw new Error('Invalid path: path is empty')
  const path = cwd.replace(/\\/g, '/')

  // Special case for root path
  if (path === '/') return path

  // Split and validate path components
  const parts = path.split('/').filter(Boolean)

  // Validate path structure
  if (parts.length < 1) throw new Error('Invalid path: path is empty')

  // Validate characters
  if (parts.some((p) => /[<>"|?*]/.test(p)))
    throw new Error('Invalid path: contains forbidden characters')

  // Check for illegal path patterns
  if (parts.some((p) => p === '.' || p === '..'))
    throw new Error('Invalid path: contains relative path components')

  // Determine if this is a Windows drive path or Unix path
  const isWindowsDrivePath = parts.length > 0 && parts[0].match(/^[A-Za-z]:$/)
  const isAbsolute = cwd.startsWith('/')

  if (isWindowsDrivePath) {
    // Windows path handling
    if (parts.length === 1 && parts[0].endsWith(':')) return `${parts[0]}/` // Handle Windows root path like "C:/"

    return parts.length === 1
      ? `${parts[0]}/`
      : `${parts[0]}/${parts.slice(1).join('/')}` // Handle Windows paths
  }

  // Unix path handling - preserve leading slash if original path was absolute
  return isAbsolute ? `/${parts.join('/')}` : parts.join('/')
}

export default root
