import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

/**
 * Write content to a file with automatic content type handling and path creation.
 * Supports writing strings, buffers, ArrayBuffers, TypedArrays, Blobs, and objects (auto-stringified).
 * Creates intermediate directories if they don't exist.
 *
 * @param {string} source - The path to write to. Will create directories if needed
 * @param {unknown} content - The content to write. Handled based on type:
 *   - String/Buffer: Written directly
 *   - ArrayBuffer/TypedArray: Converted to Uint8Array
 *   - Blob: Converted to Uint8Array
 *   - Object: JSON stringified
 *   - Other: Converted to string
 * @param {Object} [options] - fs.writeFile options
 * @param {string | null} [options.encoding] - File encoding
 * @param {number | string} [options.mode] - File mode (permissions)
 * @param {string} [options.flag] - File system flags (e.g. 'w' for write)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Write string content
 * await write('file.txt', 'Hello world')
 *
 * // Write binary data
 * await write('image.bin', Buffer.from([0xFF, 0x00, 0xFF]))
 *
 * // Write JSON (auto-stringified)
 * await write('config.json', {
 *   port: 3000,
 *   host: 'localhost'
 * })
 *
 * // Write with specific encoding
 * await write('utf16.txt', 'Content', {
 *   encoding: 'utf16le'
 * })
 *
 * // Write with permissions
 * await write('script.sh', '#!/bin/sh\necho hello', {
 *   mode: 0o755  // Executable
 * })
 *
 * // Write binary with typed arrays
 * const array = new Uint8Array([1, 2, 3])
 * await write('data.bin', array)
 * ```
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
