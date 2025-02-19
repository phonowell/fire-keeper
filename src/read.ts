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
 * Read a file.
 * @param source The source file.
 * @param options The option.
 * @returns The promise.
 * @example
 * ```
 * const content = await read('file.txt')
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
