import copy_ from './copy_'
import getExtname from './getExtname'
import info from './info'
import source_ from './source_'
import wrapList from './wrapList'

// function

const main_ = async (
  source: string | string[],
): Promise<void> => {

  const msg = `backed up ${wrapList(source)}`

  const sub_ = async (
    src: string,
  ): Promise<void> => {

    const suffix = getExtname(src)
    const extname = '.bak'

    await info().whisper_(async () => {
      await copy_(src, '', { extname, suffix })
    })
  }
  await Promise.all((await source_(source)).map(sub_))

  info('backup', msg)
}

// export
export default main_
