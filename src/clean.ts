import echo from './echo.js'
import getDirname from './getDirname.js'
import glob from './glob.js'
import remove from './remove.js'
import wrapList from './wrapList.js'

/**
 * Remove files and their empty parent directories
 * @param source - File paths or glob patterns to clean
 * @example
 * clean('temp/debug.log') // Removes file and empty parent dirs
 * clean(['build/*.tmp'])  // Clean all temp files
 */
const clean = async (source: string | string[]): Promise<void> => {
  const listSource = await glob(source, { onlyFiles: false })

  if (!listSource.length) {
    echo('clean', `no files found matching ${wrapList(source)}`)
    return
  }

  await remove(source)

  // TypeScript knows listSource.length > 0 here, but noUncheckedIndexedAccess still requires explicit handling
  const dirname = getDirname(listSource.at(0) ?? '')
  const remainingFiles = await glob(`${dirname}/**/*`, { onlyFiles: true })

  if (remainingFiles.length > 0) return

  await remove(dirname)
}

export default clean
