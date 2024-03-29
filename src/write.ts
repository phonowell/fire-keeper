import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import toString from './toString'
import wrapList from './wrapList'

// function

/**
 * Write the content to the file.
 * @param source The source file.
 * @param content The content to write.
 * @param options The options.
 * @example
 * ```
 * write('file.txt', 'content')
 * ```
 */
const write = async (
  source: string,
  content: unknown,
  options?: fse.WriteFileOptions,
) => {
  await fse.outputFile(normalizePath(source), toString(content), options)
  echo('file', `wrote ${wrapList(source)}`)
}

// export
export default write
