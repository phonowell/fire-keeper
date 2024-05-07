import { Stream } from 'stream'
import { pipeline } from 'stream/promises'

import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import toString from './toString'
import wrapList from './wrapList'

// function

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

  if (content instanceof Stream.Readable) {
    await pipeline(content, fse.createWriteStream(normalizePath(source)))
    return
  }

  if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    await writeContent(source, new Uint8Array(content as ArrayBuffer), options)
    return
  }

  if (content instanceof DataView) {
    await writeContent(source, new Uint8Array(content.buffer), options)
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

  await writeContent(source, toString(content), options)
}

const writeContent = async (
  source: string,
  content: Uint8Array | string,
  options: fse.WriteFileOptions,
) => {
  await fse.outputFile(normalizePath(source), content, options)
  echo('file', `wrote ${wrapList(source)}`)
}

// export
export default write
