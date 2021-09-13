import $info, { pause, resume } from './info'
import $copy from './copy'
import $getFilename from './getFilename'
import $isExisted from './isExisted'
import $normalizePathToArray from './normalizePathToArray'
import $remove from './remove'
import $wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {
  const msg = `recovered ${$wrapList(source)}`
  await Promise.all($normalizePathToArray(source).map(sub))
  $info('recover', msg)
}

const sub = async (
  src: string,
): Promise<void> => {

  const pathBak = `${src}.bak`
  if (!await $isExisted(pathBak)) {
    $info('recover', `'${pathBak}' not found`)
    return
  }

  const filename: string = $getFilename(src)

  pause()
  await $remove(src)
  await $copy(pathBak, '', filename)
  await $remove(pathBak)
  resume()
}

// export
export default main
