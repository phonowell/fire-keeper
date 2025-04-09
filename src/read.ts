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
 * Read file contents with smart format detection and comprehensive parsing capabilities
 * @template T - Expected type of parsed content (for type-safe JSON/YAML parsing)
 * @template S - File path string literal type (for extension inference)
 * @template R - Whether to return raw buffer (true) or parsed content (false)
 *
 * @param {S} source - Path to file to read
 * @param {Object} [options] - Read options
 * @param {boolean} [options.raw=false] - Return raw buffer instead of parsed content
 *
 * @returns {Promise<Result<T, S, R> | undefined>} File contents or undefined:
 * - Text files (.txt, .md, etc): String with preserved line endings
 * - JSON files (.json): Parsed object with type T
 * - YAML files (.yml/.yaml): Parsed object with type T
 * - Binary files (with raw=true): Buffer
 * - Non-existent file: undefined
 * - Empty file: "" (string) or empty Buffer (raw)
 *
 * @example Type-safe JSON reading
 * ```ts
 * interface Config {
 *   port: number
 *   host: string
 * }
 * const config = await read<Config>('config.json')
 * //=> { port: 3000, host: 'localhost' }
 * ```
 *
 * @example Complex YAML parsing
 * ```ts
 * const data = await read('config.yml')
 * //=> {
 * //     server: { port: 8080 },
 * //     features: ['auth', 'api']
 * //   }
 * ```
 *
 * @example Binary file handling
 * ```ts
 * const buffer = await read('image.png', { raw: true })
 * //=> <Buffer ...>
 * ```
 *
 * @example Text file with line endings
 * ```ts
 * const text = await read('readme.md')
 * //=> 'Line 1\nLine 2\r\nLine 3'
 * ```
 *
 * Features:
 * - Full TypeScript type inference
 * - Automatic format detection by extension
 * - Preserves all line endings (CRLF/LF)
 * - Supports concurrent file reads
 * - Handles empty files gracefully
 * - Built-in glob pattern support
 * - JSON/YAML validation and parsing
 *
 * Supported text extensions:
 * .coffee, .css, .html, .js, .md, .pug,
 * .sh, .styl, .ts, .tsx, .txt, .xml
 *
 * Object formats:
 * - .json (with type safety)
 * - .yaml/.yml (with type safety)
 *
 * Error handling:
 * - Missing file: Returns undefined
 * - Invalid JSON/YAML: Throws parse error
 * - IO errors: Throws system error
 * - Empty file: Returns "" or empty Buffer
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
