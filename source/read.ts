import $getExtname from './getExtname'
import $info from './info'
import $parseJson from './parseJson'
import $parseString from './parseString'
import $source from './source'
import fs from 'fs'

// interface

type ItemExtObject = typeof listExtObject[number]

type ItemExtString = typeof listExtString[number]

type Option = {
  raw: boolean
}

type Result<U = undefined, T extends string = string> = U extends undefined
  ? ((T extends `${string}${ItemExtString}`
    ? string
    : T extends `${string}${ItemExtObject}`
    ? { [x: string]: unknown }
    : Buffer) | undefined)
  : U

// variable

const listExtString = [
  '.coffee', '.css',
  '.html',
  '.js',
  '.md',
  '.pug',
  '.sh', '.styl',
  '.ts', '.tsx', '.txt',
  '.xml',
] as const

const listExtObject = [
  '.json',
  '.yaml', '.yml',
] as const

// function

const main = async <U = undefined, T extends string = string>(
  source: T,
  option?: Option,
): Promise<Result<U, T>> => {

  let _source = source
  const listSource = await $source(_source)

  if (!listSource.length) {
    $info('file', `'${source}' not existed`)
    return undefined as Result<U, T>
  }
  _source = listSource[0] as T

  const content = await new Promise<Buffer>(resolve => {
    fs.readFile(_source, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  $info('file', `read '${source}'`)

  if (option?.raw) return content as Result<U, T>

  const extname = $getExtname(_source)

  if (listExtString.includes(extname as ItemExtString)) return $parseString(content) as Result<U, T>
  if (extname === '.json') return $parseJson(content)
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.load(content) as Result<U, T>
  }

  return content as Result<U, T>
}

// export
export default main