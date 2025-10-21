/**
 * Get normalized absolute path of current working directory
 * @returns Normalized CWD path with forward slashes
 * @example
 * root() // '/Users/project/src' (Unix) or 'C:/Users/project/src' (Windows)
 */
const root = () => {
  const cwd = process.cwd()
  if (!cwd) throw new Error('Invalid path: path is empty')

  const path = cwd.replace(/\\/g, '/')

  // Special case for root path
  if (path === '/') return path

  const parts = path.split('/').filter(Boolean)

  if (parts.length < 1) throw new Error('Invalid path: path is empty')
  if (parts.some((p) => /[<>"|?*]/.test(p)))
    throw new Error('Invalid path: contains forbidden characters')
  if (parts.some((p) => p === '.' || p === '..'))
    throw new Error('Invalid path: contains relative path components')

  const firstPart = parts.at(0)
  const isWindowsDrivePath = parts.length > 0 && firstPart?.match(/^[A-Za-z]:$/)

  if (isWindowsDrivePath) {
    return parts.length === 1
      ? `${firstPart}/`
      : `${firstPart}/${parts.slice(1).join('/')}`
  }

  // Unix path handling - preserve leading slash if original path was absolute
  return cwd.startsWith('/') ? `/${parts.join('/')}` : parts.join('/')
}

export default root
