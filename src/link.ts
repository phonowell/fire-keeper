import fse from 'fs-extra'

import echo from './echo.js'
import glob from './glob.js'
import normalizePath from './normalizePath.js'

/**
 * Creates a symbolic link from source to target
 * @param {string} source - Source path (supports glob patterns)
 * @param {string} target - Target path for the symlink
 * @returns {Promise<void>} Resolves when link is created, or silently if no source matches
 * @throws {Error} If source exists but link creation fails (e.g., permissions)
 * @example
 * await link('config.json', 'config.link.json')
 * await link('configs/*.json', 'current.json') // uses first match
 * await link('src/', 'link/') // directory (may need elevation on Windows)
 */
const link = async (source: string, target: string): Promise<void> => {
  const sourcePaths = await glob(source, {
    onlyFiles: false,
  })
  if (!sourcePaths[0]) return

  const normalizedTarget = normalizePath(target)
  if (!normalizedTarget.length) return

  await fse.ensureSymlink(sourcePaths[0], normalizedTarget)

  echo('link', `linked '${source}' to '${target}'`)
}

export default link
