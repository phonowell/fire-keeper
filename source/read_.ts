import fs from 'fs'
import getExtname from './getExtname'
import info from './info'
import parseJson from './parseJson'
import parseString from './parseString'
import source_ from './source_'

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

async function main_(
  source: string,
  option: {
    raw?: boolean
  } = {}): Promise<unknown> {

  let _source = source
  const listSource = await source_(_source)

  if (!listSource.length) {
    info('file', `'${source}' not existed`)
    return null
  }
  _source = listSource[0]

  const content = await new Promise(resolve => {
    fs.readFile(_source, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  info('file', `read '${source}'`)

  if (option.raw) return content

  const extname = getExtname(_source)

  if (listExtnameOfString.includes(extname)) return parseString(content)
  if (extname === '.json') return parseJson(content)
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = (await import('js-yaml')).default
    return jsYaml.safeLoad(content)
  }

  return content
}

// export
export default main_
