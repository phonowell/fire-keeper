/**
 * Get the root path of the project
 * @returns - The root path of the project
 * @throws {Error} - If path is invalid or contains illegal characters
 * @throws {Error} - If current working directory doesn't exist
 * @example
 * ```
 * root()
 * //=> '/Users/johndoe/project'
 * ```
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
