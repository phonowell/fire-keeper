import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import fse from 'fs-extra'

import echo from './echo.js'
import getFilename from './getFilename.js'
import normalizePath from './normalizePath.js'

import type { ReadableStream as WebReadableStream } from 'stream/web'

type Options = {
  echo?: boolean
}

const isNodeReadable = (input: unknown): input is Readable =>
  input instanceof Readable

const isWebReadable = (
  input: unknown,
): input is WebReadableStream<Uint8Array> =>
  !!input &&
  typeof (input as WebReadableStream<Uint8Array>).getReader === 'function'

const toReadable = async (response: Response): Promise<Readable> => {
  if (!response.body) throw new Error('download: response has no body')

  if (isNodeReadable(response.body)) return response.body
  if (isWebReadable(response.body)) {
    return Readable.fromWeb(
      response.body as unknown as WebReadableStream<Uint8Array>,
    )
  }

  return Readable.from(Buffer.from(await response.arrayBuffer()))
}

/**
 * Download file from URL
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
  filename?: string,
  { echo: shouldEcho = true }: Options = {},
): Promise<void> => {
  if (!url) throw new TypeError('download: url is required')
  if (!dir) throw new TypeError('download: dir is required')
  const targetFilename = filename ?? getFilename(url)

  const response = await fetch(url)
  if (!response.ok) throw new Error(`download: ${response.statusText}`)

  const normalizedDir = normalizePath(dir)
  await fse.ensureDir(normalizedDir)

  await pipeline(
    await toReadable(response),
    fse.createWriteStream(path.join(normalizedDir, targetFilename)),
  )

  if (shouldEcho) {
    echo(
      'download',
      `downloaded **${url}** to **${normalizedDir}**, as **${targetFilename}**`,
    )
  }
}

export default download
