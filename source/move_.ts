import copy_ from './copy_'
import info from './info'
import parseString from './parseString'
import remove_ from './remove_'
import source_ from './source_'
import wrapList from './wrapList'
// interface

type Argument = Parameters<typeof copy_>

// function

async function main_(
  source: Argument[0],
  target: Argument[1],
  option?: Argument[2]
): Promise<void> {

  const listSource = await source_(source)
  if (!listSource.length) return

  await info().whisper_(async () => {
    await copy_(listSource, target, option)
    await remove_(listSource)
  })

  let msg = `moved ${wrapList(listSource)} to '${target}'`
  if (option)
    msg += `, as '${parseString(option)}'`
  info('file', msg)
}

// export
export default main_
