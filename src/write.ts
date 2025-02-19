import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

/**
 * Writes provided content to a specified file.
 * @param source - The target file where content will be written.
 * @param content - The content to be written to the file. Can be of various types including string, Buffer, ArrayBuffer, etc.
 * @param options - Optional. The file system write options.
 * @example
 * ```
 * write('example.txt', 'Sample content')
 * ```
 */
const write = async (
  source: string,
  content: unknown,
  options: fse.WriteFileOptions = {},
) => {
  if (typeof content === 'string' || content instanceof Buffer) {
    await writeContent(source, content, options)
    return
  }

  if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    await writeContent(source, new Uint8Array(content as ArrayBuffer), options)
    return
  }

  if (content instanceof Blob) {
    await writeContent(
      source,
      new Uint8Array(await content.arrayBuffer()),
      options,
    )
    return
  }

  const str =
    typeof content === 'object' && content !== null
      ? JSON.stringify(content)
      : String(content)
  await writeContent(source, str, options)
}

const writeContent = async (
  source: string,
  content: Uint8Array | string,
  options: fse.WriteFileOptions,
) => {
  await fse.outputFile(normalizePath(source), content, options)
  echo('write', `wrote ${wrapList(source)}`)
}

export default write
