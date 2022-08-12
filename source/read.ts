import fs from 'fs'
import getExtname from './getExtname'
import glob from './glob'
import log from './log'
import toJson from './toJson'
import toString from './toString'

// interface

type ItemExtObject = typeof listExtObject[number]

type ItemExtString = typeof listExtString[number]

type Options<R extends boolean> = {
  raw: R
}

type Result<
  T = undefined,
  S extends string = string,
  R extends boolean = false
> = T extends undefined
  ? R extends true
    ? Buffer | undefined
    :
        | (S extends `${string}${ItemExtString}`
            ? string
            : S extends `${string}${ItemExtObject}`
            ? { [x: string]: unknown }
            : Buffer)
        | undefined
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

const main = async <
  T = undefined,
  S extends string = string,
  R extends boolean = false
>(
  source: S,
  options?: Options<R>
): Promise<Result<T, S, R>> => {
  let src = source
  const listSource = await glob(src)

  if (!listSource.length) {
    log('file', `'${source}' not existed`)
    return undefined as Result<T, S, R>
  }
  src = listSource[0] as S

  const content = await new Promise<Buffer>(resolve => {
    fs.readFile(src, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  log('file', `read '${source}'`)

  if (options?.raw) return content as Result<T, S, R>

  const extname = getExtname(src)

  if (listExtString.includes(extname as ItemExtString))
    return toString(content) as Result<T, S, R>
  if (extname === '.json') return toJson(content) as Result<T, S, R>
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.load(content.toString()) as Result<T, S, R>
  }

  return content as Result<T, S, R>
}

// export
export default main
