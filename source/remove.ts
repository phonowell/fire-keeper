import echo from './echo'
import fse from 'fs-extra'
import glob from './glob'
import wrapList from './wrapList'

// function

const main = async (source: string | string[]) => {
  const listSource = await glob(source, { onlyFiles: false })
  for (const src of listSource) {
    await fse.remove(src)
  }
  echo('remove', `removed ${wrapList(source)}`)
}

// export
export default main
