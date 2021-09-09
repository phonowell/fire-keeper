import $info from './info'
import $normalizePathToArray from './normalizePathToArray'
import $parseString from './parseString'
import $read from './read'
import $stat from './stat'

// function

const main = async (
  source: string | string[],
): Promise<boolean> => {

  const listSource = $normalizePathToArray(source)
  if (listSource.length < 2) return false

  // size
  let cacheSize = 0

  for (const src of listSource) {
    const stat = await $stat(src)
    if (!stat) return false

    const { size } = stat

    if (!cacheSize) {
      cacheSize = size
      continue
    }

    if (size !== cacheSize) return false
  }

  // content
  let cacheCont = ''
  for (const src of listSource) {
    let cont = await $info().whisper_<string>(async () => await $read(src))
    if (!cont) return false

    cont = $parseString(cont)

    if (!cacheCont) {
      cacheCont = cont
      continue
    }

    if (cont !== cacheCont) return false
  }

  return true
}

// export
export default main