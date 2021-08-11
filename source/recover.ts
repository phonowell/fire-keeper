import $copy from './copy'
import $getFilename from './getFilename'
import $info from './info'
import $isExisted from './isExisted'
import $normalizePathToArray from './normalizePathToArray'
import $remove from './remove'
import $wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const msg = `recovered ${$wrapList(source)}`

  const sub = async (
    src: string,
  ): Promise<void> => {

    const pathBak = `${src}.bak`
    if (!await $isExisted(pathBak)) {
      $info('recover', `'${pathBak}' not found`)
      return
    }

    const filename: string = $getFilename(src)

    $info().pause()
    await $remove(src)
    await $copy(pathBak, '', filename)
    await $remove(pathBak)
    $info().resume()
  }
  await Promise.all($normalizePathToArray(source).map(sub))

  $info('recover', msg)
}

// export
export default main
