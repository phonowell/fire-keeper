import $ from '..'

// interface

type IArgument = Parameters<typeof $.copy_>

// function

async function main_(
  source: IArgument[0],
  target: IArgument[1],
  option?: IArgument[2]
): Promise<void> {

  const listSource = await $.source_(source)
  if (!listSource.length) return

  await $.info().whisper_(async () => {
    await $.copy_(listSource, target, option)
    await $.remove_(listSource)
  })

  let msg = `moved ${$.wrapList(listSource)} to '${target}'`
  if (option)
    msg += `, as '${$.parseString(option)}'`
  $.info('file', msg)
}

// export
export default main_