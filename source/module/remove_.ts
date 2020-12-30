import $ from '..'
import fse from 'fs-extra'

// function

async function main_(
  source: string | string[]
): Promise<void> {

  const listSource = await $.source_(source)
  if (!listSource.length) return

  const msg = `removed ${$.wrapList(source)}`

  async function sub_(
    src: string
  ): Promise<void> {

    await fse.remove(src)
  }
  await Promise.all(listSource.map(sub_))

  $.info('remove', msg)
}

// export
export default main_
