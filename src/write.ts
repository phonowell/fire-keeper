import fse from 'fs-extra'

import echo from './echo.js'
import normalizePath from './normalizePath.js'
import wrapList from './wrapList.js'

/**
 * Write content to file with automatic type handling and path creation
 * @param source - File path (directories created if needed)
 * @param content - Content (string, Buffer, Blob, objects auto-stringified)
 * @param options - File writing options (encoding, mode, flag)
 * @example
 * await write('file.txt', 'Hello world')
 * await write('config.json', { port: 3000 })  // Auto-stringified
 */
const write = async (
  source: string,
  content: unknown,
  options: fse.WriteFileOptions = {},
): Promise<void> => {
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
