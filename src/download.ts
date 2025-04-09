import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import fse from 'fs-extra'

import echo from './echo'
import getFilename from './getFilename'
import normalizePath from './normalizePath'

/**
 * Downloads file from URL using stream processing
 * - Auto-creates target directory if missing
 * - Supports binary files and Unicode filenames
 * - Normalizes directory paths
 * @param {string} url - URL to download from
 * @param {string} dir - Target directory path
 * @param {string} [filename] - Optional custom filename, defaults to URL filename
 * @throws {TypeError} Invalid URL or directory
 * @throws {Error} Network errors, non-200 responses, empty bodies, I/O failures
 */
const download = async (
  url: string,
  dir: string,
  filename = getFilename(url),
): Promise<void> => {
  // 检查 URL 是否有效
  if (!url) throw new TypeError('download: url is required')

  // 检查目录是否有效
  if (!dir) throw new TypeError('download: dir is required')

  // 下载文件
  const response = await fetch(url)

  // 检查响应是否成功
  if (!response.ok) throw new Error(`download: ${response.statusText}`)

  // 检查响应是否有 body
  if (!response.body) throw new Error('download: response has no body')

  // 读取响应内容
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const readableStream = Readable.from(buffer)

  // 创建目录
  dir = normalizePath(dir)
  await fse.ensureDir(dir)

  // 写入文件
  await pipeline(
    readableStream,
    fse.createWriteStream(path.join(dir, filename)),
  )

  // 输出信息
  echo('download', `downloaded '${url}' to '${dir}', as '${filename}'`)
}

export default download
