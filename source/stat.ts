import fs from 'fs'
import isExisted from './isExisted'
import log from './log'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

// function

const main = async (source: string): Promise<fs.Stats | null> => {
  const _source = normalizePath(source)

  if (!(await isExisted(_source))) {
    log('file', `${wrapList(_source)} not existed`)
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
export default main
