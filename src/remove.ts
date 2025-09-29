import fse from 'fs-extra'

import echo from './echo.js'
import glob from './glob.js'
import runConcurrent from './runConcurrent.js'
import wrapList from './wrapList.js'

type Options = {
  concurrency?: number
}

/**
 * Remove files and directories with glob pattern support
 * @param source - Path(s) to remove (files, directories, or patterns)
 * @param options - Configuration with concurrency setting
 * @example
 * remove('temp/file.txt')
 * remove(['logs/*.log', 'cache/'], { concurrency: 3 })
 */
const remove = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(source, { onlyFiles: false })

  if (!listSource.length) {
    echo('remove', `no files found matching ${wrapList(source)}`)
    return
  }

  await runConcurrent(
    concurrency,
    listSource.map((src) => () => fse.remove(src)),
  )

  echo('remove', `removed ${wrapList(source)}`)
}

export default remove
