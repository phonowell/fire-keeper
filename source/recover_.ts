import copy_ from './copy_'
import getFilename from './getFilename'
import info from './info'
import isExisted_ from './isExisted_'
import normalizePathToArray from './normalizePathToArray'
import remove_ from './remove_'
import wrapList from './wrapList'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  const msg = `recovered ${wrapList(source)}`

  async function sub_(
    src: string
  ): Promise<void> {

    const pathBak = `${src}.bak`
    if (!await isExisted_(pathBak)) {
      info('recover', `'${pathBak}' not found`)
      return
    }

    const filename: string = getFilename(src)

    info().pause()
    await remove_(src)
    await copy_(pathBak, '', filename)
    await remove_(pathBak)
    info().resume()
  }
  await Promise.all(normalizePathToArray(source).map(sub_))

  info('recover', msg)
}

// export
export default main_
