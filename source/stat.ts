import echo from './echo'
import fs from 'fs'
import isExist from './isExist'
import normalizePath from './normalizePath'
import wrapList from './wrapList'

// function

const main = async (source: string): Promise<fs.Stats | null> => {
  const _source = normalizePath(source)

  if (!(await isExist(_source))) {
    echo('file', `${wrapList(_source)} not existed`)
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
