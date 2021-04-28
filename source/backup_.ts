import $copy from './copy_'
import $getExtname from './getExtname'
import $info from './info'
import $source from './source_'
import $wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const msg = `backed up ${$wrapList(source)}`

  const sub_ = async (
    src: string,
  ): Promise<void> => {

    const suffix = $getExtname(src)
    const extname = '.bak'

    await $info().whisper_(async () => await $copy(src, '', { extname, suffix }))
  }
  await Promise.all((await $source(source)).map(sub_))

  $info('backup', msg)
}

// export
export default main