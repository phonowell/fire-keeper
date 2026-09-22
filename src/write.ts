import fse from 'fs-extra'

import echo from './echo.js'
import normalizePath from './normalizePath.js'
import wrapList from './wrapList.js'

type Options = Extract<fse.WriteFileOptions, object> & {
  echo?: boolean
}

/**
 * Write content to file with automatic type handling and path creation
 * @param source - File path (directories created if needed)
 * @param content - Content (string, Buffer, Blob, objects auto-stringified)
 * @param options - File writing options (encoding, mode, flag) plus {echo?} to silence logs
 * @example
 * await write('file.txt', 'Hello world')
 * await write('config.json', { port: 3000 })  // Auto-stringified
 * await write('log.txt', 'data', { echo: false })  // Silent write
 */
const write = async (
  source: string,
  content: unknown,
  options: Options = {},
  ...rest: unknown[]
): Promise<void> => {
  if (rest.length) throw new TypeError('write: too many arguments — merge { echo } into options')

  const opts: Options =
    typeof options === 'object' && options !== null ? options : { encoding: options }
  const { echo: shouldEcho = true, ...fseOptions } = opts

  if (typeof content === 'string' || content instanceof Buffer) {
    await writeContent(source, content, fseOptions, shouldEcho)
    return
  }

  if (content instanceof ArrayBuffer) {
    await writeContent(source, new Uint8Array(content), fseOptions, shouldEcho)
    return
  }

  if (ArrayBuffer.isView(content)) {
    await writeContent(
      source,
      new Uint8Array(content.buffer, content.byteOffset, content.byteLength),
      fseOptions,
      shouldEcho,
    )
    return
  }

  if (content instanceof Blob) {
    await writeContent(source, new Uint8Array(await content.arrayBuffer()), fseOptions, shouldEcho)
    return
  }

  const str =
    typeof content === 'object' && content !== null ? JSON.stringify(content) : String(content)

  await writeContent(source, str, fseOptions, shouldEcho)
}

const writeContent = async (
  source: string,
  content: Uint8Array | string,
  options: fse.WriteFileOptions,
  shouldEcho: boolean,
) => {
  await fse.outputFile(normalizePath(source), content, options)
  if (shouldEcho) echo('write', `wrote **${wrapList(source)}**`)
}

export default write
