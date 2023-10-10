import copy from './copy'
import echo from './echo'
import glob from './glob'
import wrapList from './wrapList'

// function

const main = async (source: string | string[]) => {
  const listSource = await glob(source)
  for (const src of listSource) {
    await copy(src, '', filename => `${filename}.bak`)
  }
  echo('backup', `backed up ${wrapList(source)}`)
}

// export
export default main
