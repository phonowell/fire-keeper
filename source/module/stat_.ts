import $ from '..'
import fs from 'fs'

// function

async function main_(
  source: string
): Promise<fs.Stats | null> {

  source = $.normalizePath(source)

  if (!await $.isExisted_(source)) {
    $.info('file', `${$.wrapList(source)} not existed`)
    return null
  }

  return await new Promise(resolve => {
    fs.stat(source, (err, stat) => {
      if (err) throw err
      resolve(stat)
    })
  })
}

// export
export default main_