import glob from './glob'
import log from './log'
import read from './read'
import wrapList from './wrapList'
import write from './write'


// function

const backup = async (
  src: string,
) => {
  const target = `${src}.bak`
  const content = await read(src)
  await write(target, content)
}

const main = async (
  source: string | string[],
) => {
  const listSource = await glob(source)
  for (const src of listSource) {
    await backup(src)
  }
  log('backup', `backed up ${wrapList(source)}`)
}

// export
export default main