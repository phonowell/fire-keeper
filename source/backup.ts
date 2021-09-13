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
  await Promise.all((await $source(source)).map(sub))
  $info('backup', msg)
}

const sub = async (
  src: string,
): Promise<void> => {
  const suffix = $getExtname(src)
  const extname = '.bak'
  await $info.whisper($copy(src, '', { extname, suffix }))
}

// export
export default main