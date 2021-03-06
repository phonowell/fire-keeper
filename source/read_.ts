import $getExtname from './getExtname'
import $info from './info'
import $parseJson from './parseJson'
import $parseString from './parseString'
import $source from './source_'
import fs from 'fs'

// interface

type Main = {
  <T>(source: string): Promise<T>
  (source: string, option: Option): Promise<Buffer | undefined>
}

type Option = {
  raw: boolean
}

// variable

const listExtnameOfString = [
  '.css',
  '.html',
  '.js',
  '.md',
  '.pug',
  '.sh',
  '.styl',
  '.ts',
  '.txt',
  '.xml',
  '.coffee',
]

// function

const main: Main = async (
  source: string,
  option?: Option,
) => {

  let _source = source
  const listSource = await $source(_source)

  if (!listSource.length) {
    $info('file', `'${source}' not existed`)
    return undefined
  }
  _source = listSource[0]

  const content = await new Promise<Buffer>(resolve => {
    fs.readFile(_source, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  $info('file', `read '${source}'`)

  if (option?.raw) return content

  const extname = $getExtname(_source)

  if (listExtnameOfString.includes(extname)) return $parseString(content)
  if (extname === '.json') return $parseJson(content)
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.load(content)
  }

  return content
}

// export
export default main