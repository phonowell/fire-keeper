import fse from 'fs-extra'

import echo from './echo'
import getExtname from './getExtname'
import glob from './glob'

type ItemExtObject = '.json' | '.yaml' | '.yml'

type ItemExtString = (typeof EXTNAMES)[number]

type Options = {
  raw?: boolean
}

type Result<T, S extends string, R extends boolean> = T extends undefined
  ? R extends true
    ? Buffer
    : S extends `${string}${ItemExtString}`
      ? string
      : S extends `${string}${ItemExtObject}`
        ? Record<string, unknown>
        : Buffer
  : T

// variable

const EXTNAMES = [
  '.coffee',
  '.css',
  '.html',
  '.js',
  '.md',
  '.pug',
  '.sh',
  '.styl',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
] as const

/**
 * Read file contents with automatic format detection and parsing based on file extension.
 * Handles text, JSON, YAML, and binary files with appropriate parsing.
 *
 * @template T - Expected type of the parsed content (for JSON/YAML files)
 * @template S - File path string literal type (for extension inference)
 * @template R - Whether to return raw buffer (true) or parsed content (false)
 *
 * @param {S} source - Path to the file to read
 * @param {Object} [options] - Read options
 * @param {boolean} [options.raw=false] - Return raw buffer instead of parsed content
 *
 * @returns {Promise<Result<T, S, R> | undefined>} File contents or undefined if file doesn't exist:
 *   - Text files (.txt, .md, etc): String content
 *   - JSON files: Parsed object
 *   - YAML/YML files: Parsed object
 *   - With raw=true: Buffer
 *   - Non-existent file: undefined
 *
 * @example
 * // Text file - returns string
 * const text = await read('readme.md')
 *
 * // JSON with type safety
 * interface Config {
 *   port: number
 *   host: string
 * }
 * const config = await read<Config>('config.json')
 *
 * // YAML/YML files
 * const data = await read('config.yml')
 *
 * // Binary files
 * const buffer = await read('image.png', { raw: true })
 *
 * // Non-existent file
 * const missing = await read('not-found.txt')  // undefined
 *
 * // Empty file
 * const empty = await read('empty.txt')  // returns ""
 * const emptyRaw = await read('empty.txt', { raw: true })  // returns empty Buffer
 */
const read = async <
  T = undefined,
  S extends string = string,
  R extends boolean = false,
>(
  source: S,
  options?: Options,
): Promise<Result<T, S, R> | undefined> => {
  let src = source
  const listSource = await glob(src)

  if (!listSource.length) {
    echo('read', `'${source}' not existed`)
    return undefined
  }
  src = listSource[0] as S

  const content = await fse.readFile(src)
  echo('read', `read '${source}'`)

  if (options?.raw) return content as Result<T, S, R>

  const extname = getExtname(src)

  if (EXTNAMES.includes(extname as ItemExtString))
    return String(content) as Result<T, S, R>
  if (extname === '.json') return JSON.parse(String(content)) as Result<T, S, R>
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.load(content.toString()) as Result<T, S, R>
  }

  return content as Result<T, S, R>
}

export default read
