import fse from 'fs-extra'

import echo from './echo.js'
import normalizePath from './normalizePath.js'
import wrapList from './wrapList.js'

type EchoOption = {
  echo?: boolean
}

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
  { echo: shouldEcho = true }: EchoOption = {},
): Promise<void> => {
  if (typeof content === 'string' || content instanceof Buffer) {
    await writeContent(source, content, options, shouldEcho)
    return
  }

  if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
    await writeContent(
      source,
      new Uint8Array(content as ArrayBuffer),
      options,
      shouldEcho,
    )
    return
  }

  if (content instanceof Blob) {
    await writeContent(
      source,
      new Uint8Array(await content.arrayBuffer()),
      options,
      shouldEcho,
    )
    return
  }

  const str =
    typeof content === 'object' && content !== null
      ? JSON.stringify(content)
      : String(content)

  await writeContent(source, str, options, shouldEcho)
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
