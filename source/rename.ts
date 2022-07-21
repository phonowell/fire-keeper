import fs from 'fs'
import getDirname from './getDirname'
import log from './log'
import normalizePath from './normalizePath'

// function

const main = async (
  source: string,
  target: string,
) => {
  const src = normalizePath(source)
  await new Promise(resolve => fs.rename(src, `${getDirname(src)}/${target}`, resolve))
  log('file', `renamed '${source}' as '${target}'`)
}

// export
export default main