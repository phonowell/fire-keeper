import $copy from './copy'
import $getExtname from './getExtname'
import $info from './info'
import $source from './source'
import $wrapList from './wrapList'

// function

const main = async (
  source: string | string[],
): Promise<void> => {

  const msg = `backed up ${$wrapList(source)}`

  const sub = async (
    src: string,
  ): Promise<void> => {

    const suffix = $getExtname(src)
    const extname = '.bak'

    await $info().whisper_(async () => await $copy(src, '', { extname, suffix }))
  }
  await Promise.all((await $source(source)).map(sub))

  $info('backup', msg)
}

// export
export default main