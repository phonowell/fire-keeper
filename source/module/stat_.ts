import $ from '..'
import fs from 'fs'

// function

async function main_(
  source: string
): Promise<fs.Stats | null> {

  const _source = $.normalizePath(source)

  if (!await $.isExisted_(_source)) {
    $.info('file', `${$.wrapList(_source)} not existed`)
    return null
  }

  return new Promise(resolve => {
    fs.stat(_source, (err, stat) => {
      if (err) throw err
      resolve(stat)
    })
  })
}

// export
export default main_
