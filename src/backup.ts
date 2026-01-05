import copy from './copy.js'
import echo from './echo.js'
import glob from './glob.js'
import wrapList from './wrapList.js'

type Options = {
  concurrency?: number
}

/**
 * Create .bak backup copies of files
 * @param source - File paths or glob patterns to backup
 * @param options - Configuration with concurrency setting
 * @example
 * backup('config.json') // Creates config.json.bak
 * backup(['*.ts'], { concurrency: 3 })
 */
const backup = async (
  source: string | string[],
  { concurrency = 5 }: Options = {},
): Promise<void> => {
  const listSource = await glob(source, { onlyFiles: true })

  if (!listSource.length) {
    echo('backup', `no files found matching **${wrapList(source)}**`)
    return
  }

  await copy(listSource, '', {
    concurrency,
    filename: (filename) => `${filename}.bak`,
  })

  echo('backup', `backed up **${wrapList(source)}**`)
}

export default backup
