import fse from 'fs-extra'

import echo from './echo.js'
import getExtname from './getExtname.js'
import glob from './glob.js'

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
 * Read file contents with smart format detection and parsing
 * @template T - Expected type of parsed content (for type-safe JSON/YAML parsing)
 * @template S - File path string literal type (for extension inference)
 * @template R - Whether to return raw buffer (true) or parsed content (false)
 * @param {S} source - Path to file to read
 * @param {Object} [options] - Read options
 * @param {boolean} [options.raw=false] - Return raw buffer instead of parsed content
 * @returns {Promise<Result<T, S, R> | undefined>} Parsed content based on file extension:
 * text→string, json/yaml→object, raw→Buffer, non-existent→undefined
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
