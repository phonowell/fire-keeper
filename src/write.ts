import fse from 'fs-extra'

import echo from './echo.js'
import normalizePath from './normalizePath.js'
import wrapList from './wrapList.js'

/**
 * Writes content to a file with path creation and automatic content type handling.
 * @param source File path to write to (directories created if needed)
 * @param content Content to write - handles strings, Buffer, typed arrays, Blob, and objects
 * @param options File writing options (encoding, mode, flag)
 * @example
 * // Write string content
 * await write('file.txt', 'Hello world')
 *
 * // Write JSON (auto-stringified)
 * await write('config.json', { port: 3000 })
 *
 * // Write binary data with permissions
 * await write('data.bin', new Uint8Array([1, 2, 3]), { mode: 0o644 })
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
