import fs from 'fs'

import echo from './echo'
import getExtname from './getExtname'
import glob from './glob'
import toJSON from './toJSON'
import toString from './toString'

// interface

type ItemExtObject = (typeof listExtObject)[number]

type ItemExtString = (typeof listExtString)[number]

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

const listExtString = [
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

const listExtObject = ['.json', '.yaml', '.yml'] as const

// function

/**
 * Read a file.
 * @param source The source file.
 * @param option The option.
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
  option?: {
    raw?: R
  },
): Promise<Result<T, S, R> | undefined> => {
  let src = source
  const listSource = await glob(src)

  if (!listSource.length) {
    echo('file', `'${source}' not existed`)
    return undefined
  }
  src = listSource[0] as S

  const content = await new Promise<Buffer>(resolve => {
    fs.readFile(src, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  echo('file', `read '${source}'`)

  if (option?.raw) return content as Result<T, S, R>

  const extname = getExtname(src)

  if (listExtString.includes(extname as ItemExtString))
    return toString(content) as Result<T, S, R>
  if (extname === '.json') return toJSON(content) as Result<T, S, R>
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.load(content.toString()) as Result<T, S, R>
  }

  return content as Result<T, S, R>
}

// export
export default read
