import $info, { whisper } from './info'
import $copy from './copy'
import $parseString from './parseString'
import $remove from './remove'
import $source from './source'
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

  await whisper(async () => {
    await $copy(listSource, target, option)
    await $remove(listSource)
  })

  let msg = `moved ${$wrapList(listSource)} to '${target}'`
  if (option) msg += `, as '${$parseString(option)}'`
  $info('file', msg)
}

// export
export default main
