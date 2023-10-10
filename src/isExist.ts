import fse from 'fs-extra'
import flatten from 'lodash/flatten'

import normalizePath from './normalizePath'

// function

const main = async (...args: (string | string[])[]) => {
  const group = flatten(args).map(normalizePath)
  if (!group.length) return false

  for (const source of group) {
    if (source.includes('*')) throw new Error(`invalid path '${source}'`)
    if (!(await fse.pathExists(source))) return false
  }

  return true
}

// export
export default main
