import { echo, wrapList } from 'fire-keeper'

import getDirname from './getDirname'
import glob from './glob'
import remove from './remove'

/**
 * Removes files and their empty parent directories
 * @param source - File path(s) or glob pattern(s) to clean
 * @returns Promise resolving when cleaning is complete
 * @example
 * clean('temp/logs/debug.log') // Removes file and empty parents
 * clean(['build/temp/*.txt']) // Removes matching files
 */
const clean = async (source: string | string[]): Promise<void> => {
  const listSource = await glob(source, {
    onlyFiles: false,
  })
  if (!listSource.length) {
    echo('clean', `no files found matching ${wrapList(source)}`)
    return
  }

  await remove(source)

  const dirname = getDirname(listSource[0])
  if (
    (
      await glob(`${dirname}/**/*`, {
        onlyFiles: true,
      })
    ).length
  )
    return

  await remove(dirname)
}

export default clean
