import $ from '..'
import fs from 'fs'

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
  '.coffee'
]

// function

async function main_(
  source: string,
  option: {
    raw?: boolean
  } = {}): Promise<unknown> {

  const _source = source
  const listSource = await $.source_(source)

  if (!listSource.length) {
    $.info('file', `'${_source}' not existed`)
    return null
  }
  source = listSource[0]

  const content = await new Promise(resolve => {
    fs.readFile(source, (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  $.info('file', `read '${_source}'`)

  if (option.raw) return content

  const extname = $.getExtname(source)

  if (listExtnameOfString.includes(extname)) return $.parseString(content)
  if (extname === '.json') return $.parseJson(content)
  if (['.yaml', '.yml'].includes(extname)) {
    const jsYaml = require('js-yaml')
    return jsYaml.safeLoad(content)
  }

  return content
}

// export
export default main_