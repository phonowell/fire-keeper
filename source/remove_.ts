import fse from 'fs-extra'
import info from './info'
import source_ from './source_'
import wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const listSource = await source_(source)
  if (!listSource.length) return

  const msg = `removed ${wrapList(source)}`

  const sub = async (
    src: string,
  ): Promise<void> => {

    await fse.remove(src)
  }
  await Promise.all(listSource.map(sub))

  info('remove', msg)
}

// export
export default main