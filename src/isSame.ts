import echo from './echo.js'
import flatten from './flatten.js'
import normalizePath from './normalizePath.js'
import read from './read.js'
import stat from './stat.js'

type EchoOption = {
  echo?: boolean
}

type Source = string | string[]

const isEchoOption = (input: unknown): input is EchoOption =>
  typeof input === 'object' &&
  input !== null &&
  !Array.isArray(input) &&
  ('echo' in input || Object.keys(input).length === 0)

/**
 * Compare multiple files for binary content equality
 * @param args - File paths to compare (minimum 2 required)
 * @returns Promise resolving to true if all files have identical content
 * @example
 * await isSame('file1.txt', 'file2.txt')     // Compare two files
 * await isSame(['v1.txt', 'v2.txt'], 'v3.txt')  // Compare arrays with single
 */
function isSame(...args: [...Source[], EchoOption]): Promise<boolean>
function isSame(...args: Source[]): Promise<boolean>
async function isSame(...args: (Source | EchoOption)[]): Promise<boolean> {
  const last = args.at(-1)
  const options = isEchoOption(last) ? last : {}
  const listSource = isEchoOption(last)
    ? (args.slice(0, -1) as Source[])
    : (args as Source[])

  const shouldEcho = options.echo ?? true
  const originalGroup = flatten(listSource)
  const group = originalGroup.map(normalizePath).filter(Boolean)

  if (group.length < 2) return false
  if (group.length !== originalGroup.length) return false

  // 检查文件大小
  let cacheSize = 0
  for (const source of group) {
    const stats = await stat(source, { echo: shouldEcho })
    if (!stats) return false

    const { size } = stats
    if (!size) return false // 如果文件大小为 0，则直接返回 false

    if (!cacheSize) {
      cacheSize = size
      continue
    }

    if (size !== cacheSize) return false
  }

  // 检查文件内容
  let cacheCont: Buffer | undefined
  for (const source of group) {
    const cont = await echo.freeze(
      read(source, { echo: shouldEcho, raw: true }),
    )
    if (!cont) return false // 如果文件内容为空，则直接返回 false

    if (!cacheCont) {
      cacheCont = cont
      continue
    }

    if (Buffer.compare(cont, cacheCont) !== 0) return false
  }

  return true
}

export default isSame
