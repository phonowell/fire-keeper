import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import fse from 'fs-extra'

import echo from './echo'
import getFilename from './getFilename'
import normalizePath from './normalizePath'

/**
 * Downloads a file from a URL and saves it to the specified directory.
 * @param {string} url - The URL of the file to download
 * @param {string} dir - The target directory where the file will be saved
 * @param {string} [filename] - Optional custom filename. If not provided, extracts filename from URL
 * @returns {Promise<void>} Promise that resolves when download is complete
 * @throws {Error} If:
 *   - URL response is not ok (non-200 status)
 *   - Response has no body
 *   - Network error occurs
 *   - File system operation fails
 *   - Stream pipeline fails
 * @throws {TypeError} If:
 *   - URL is invalid or empty
 *   - Directory path is invalid or empty
 * @example
 * ```typescript
 * // Basic download with auto-generated filename
 * await download('https://example.com/file.txt', 'downloads');
 *
 * // Download with custom filename
 * await download('https://api.example.com/data', 'data', 'report.json');
 *
 * // Download to nested directory (created automatically)
 * await download('https://cdn.example.com/image.png', 'assets/images');
 *
 * // Error handling
 * try {
 *   await download('https://example.com/file.txt', 'downloads');
 * } catch (error) {
 *   if (error instanceof TypeError) {
 *     console.error('Invalid input:', error.message);
 *   } else {
 *     console.error('Download failed:', error.message);
 *   }
 * }
 * ```
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
