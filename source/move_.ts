import $copy from './copy_'
import $info from './info'
import $parseString from './parseString'
import $remove from './remove_'
import $source from './source_'
import $wrapList from './wrapList'

// interface

type Argument = Parameters<typeof $copy>

// function

const main = async (
  source: Argument[0],
  target: Argument[1],
  option?: Argument[2],
): Promise<void> => {

  const listSource = await $source(source)
  if (!listSource.length) return

  await $info().whisper_(async () => {
    await $copy(listSource, target, option)
    await $remove(listSource)
  })

  let msg = `moved ${$wrapList(listSource)} to '${target}'`
  if (option)
    msg += `, as '${$parseString(option)}'`
  $info('file', msg)
}

// export
export default main
