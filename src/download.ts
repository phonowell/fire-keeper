import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import fse from 'fs-extra'

import echo from './echo.js'
import getFilename from './getFilename.js'
import normalizePath from './normalizePath.js'

type Options = {
  echo?: boolean
}

/**
 * Download file from URL with streaming support
 * @param url - Source URL to download from
 * @param dir - Target directory path
 * @param filename - Custom filename (auto-detected if omitted)
 * @example
 * download('https://example.com/file.zip', './downloads')
 * download('https://api.com/data', './temp', 'data.json')
 */
const download = async (
  url: string,
  dir: string,
  filename = getFilename(url),
  { echo: shouldEcho = true }: Options = {},
): Promise<void> => {
  if (!url) throw new TypeError('download: url is required')
  if (!dir) throw new TypeError('download: dir is required')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`download: ${response.statusText}`)
  if (!response.body) throw new Error('download: response has no body')

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const readableStream = Readable.from(buffer)

  const normalizedDir = normalizePath(dir)
  await fse.ensureDir(normalizedDir)

  await pipeline(
    readableStream,
    fse.createWriteStream(path.join(normalizedDir, filename)),
  )

  if (shouldEcho) {
    echo(
      'download',
      `downloaded **${url}** to **${normalizedDir}**, as **${filename}**`,
    )
  }
}

export default download
