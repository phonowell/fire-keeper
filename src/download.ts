import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import path from 'path'

import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import getFilename from './getFilename'

/**
 * Download a file.
 * @param url The URL of the file.
 * @param dir The directory to save the file.
 * @param filename The filename to save the file.
 * @returns The promise.
 * @example
 * ```
 * await download('https://example.com/file.txt', 'temp')
 * await download('https://example.com/file.txt', 'temp', 'file.txt')
 * ```
 */
const download = async (
  url: string,
  dir: string,
  filename = getFilename(url),
) => {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`)
  if (!response.body) throw new Error('No response body')

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const readableStream = Readable.from(buffer)

  dir = normalizePath(dir)
  await fse.ensureDir(dir)

  await pipeline(
    readableStream,
    fse.createWriteStream(path.join(dir, filename)),
  )
  echo('download', `downloaded '${url}' to '${dir}', as '${filename}'`)
}

export default download
