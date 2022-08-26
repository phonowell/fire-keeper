import copy from './copy'
import glob from './glob'
import log from './log'
import wrapList from './wrapList'

// function

const main = async (source: string | string[]) => {
  const listSource = await glob(source)
  for (const src of listSource) {
    await copy(src, '', filename => `${filename}.bak`)
  }
  log('backup', `backed up ${wrapList(source)}`)
}

// export
export default main
