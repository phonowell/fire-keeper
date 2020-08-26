import $ from '..'
import fse from 'fs-extra'

// function

async function main_(source: string | string[]): Promise<void> {
  const listSource = await $.source_(source)
  if (!listSource.length) return

  const msg = `removed ${$.wrapList(source)}`

  for (const source of listSource)
    await fse.remove(source)

  $.info('remove', msg)
}

// export
export default main_