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
 * Read a file with automatic content parsing based on file extension.
 * @param {S} source - The path to the file to read
 * @param {Object} [options] - Reading options
 * @param {boolean} [options.raw=false] - If true, returns raw buffer instead of parsed content
 * @returns {Promise<Result<T, S, R> | undefined>} Promise that resolves to:
 *   - Parsed JSON for .json files
 *   - Parsed YAML for .yaml/.yml files
 *   - String content for text-based files (.txt, .md, .ts, etc.)
 *   - Raw buffer for other file types
 *   - undefined if file doesn't exist
 * @example
 * ```typescript
 * // Read text file
 * const text = await read('readme.md');
 * //=> string content
 *
 * // Read JSON file with type inference
 * const config = await read('tsconfig.json');
 * //=> parsed JSON object
 *
 * // Read YAML file
 * const data = await read('config.yml');
 * //=> parsed YAML object
 *
 * // Read binary file in raw mode
 * const buffer = await read('image.png', { raw: true });
 * //=> Buffer
 *
 * // Handle non-existent file
 * const missing = await read('not-found.txt');
 * //=> undefined
 *
 * // With type parameters
 * interface Config { port: number }
 * const config = await read<Config>('config.json');
 * //=> { port: number }
 * ```
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
