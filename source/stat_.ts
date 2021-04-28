import $info from './info'
import $isExisted from './isExisted_'
import $normalizePath from './normalizePath'
import $wrapList from './wrapList'
import fs from 'fs'

// function

const main = async (
  source: string,
): Promise<fs.Stats | null> => {

  const _source = $normalizePath(source)

  if (!await $isExisted(_source)) {
    $info('file', `${$wrapList(_source)} not existed`)
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