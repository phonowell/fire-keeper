import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

/**
 * Writes provided content to a specified file.
 * @param {string} source - The target file where content will be written
 * @param {unknown} content - The content to be written to the file
 * @param {fse.WriteFileOptions} [options] - Optional file system write options
 * @returns {Promise<void>} Promise that resolves when write is complete
 * @example
 * ```typescript
 * // Write string content
 * await write('example.txt', 'Hello World');
 *
 * // Write Buffer content
 * await write('binary.dat', Buffer.from([1, 2, 3]));
 *
 * // Write ArrayBuffer content
 * const arr = new Uint8Array([65, 66, 67]);
 * await write('array.bin', arr.buffer);
 *
 * // Write Blob content
 * const blob = new Blob(['Hello'], { type: 'text/plain' });
 * await write('blob.txt', blob);
 *
 * // Write JSON object (automatically stringified)
 * await write('config.json', {
 *   port: 3000,
 *   host: 'localhost'
 * });
 *
 * // Write with options
 * await write('example.txt', 'content', {
 *   encoding: 'utf8',
 *   mode: 0o644
 * });
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
