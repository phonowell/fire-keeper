import fse from 'fs-extra'
import info from './info'
import source_ from './source'
import wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const listSource = await source_(source)
  if (!listSource.length) return

  const msg = `removed ${wrapList(source)}`

  await Promise.all(listSource.map(src => fse.remove(src)))

  info('remove', msg)
}

// export
export default main