import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import path from 'path'

import fse from 'fs-extra'

import echo from './echo'
import normalizePath from './normalizePath'
import getFilename from './getFilename'

/**
 * Downloads a file from a URL and saves it to the specified directory.
 * @param url The URL of the file to download.
 * @param dir The target directory where the file will be saved.
 * @param filename Optional custom filename. If not provided, extracts filename from URL.
 * @returns Promise that resolves when download is complete.
 * @throws {Error} If the URL response is not ok or has no body.
 * @throws {TypeError} If URL or directory parameters are invalid.
 *
 * @example Download with auto-generated filename
 * ```typescript
 * await download('https://example.com/file.txt', 'temp')
 * ```
 *
 * @example Download with custom filename
 * ```typescript
 * await download('https://example.com/file.txt', 'temp', 'custom.txt')
 * ```
 */
const download = async (
  url: string,
  dir: string,
  filename = getFilename(url),
) => {
  if (!url) {
    echo('download', 'url is required')
    return
  }

  if (!dir) {
    echo('download', 'dir is required')
    return
  }

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
