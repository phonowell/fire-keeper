import fs from 'fs'

import echo from './echo'
import getDirname from './getDirname'
import normalizePath from './normalizePath'

// function

const main = async (source: string, target: string) => {
  const src = normalizePath(source)
  await new Promise(resolve =>
    fs.rename(src, `${getDirname(src)}/${target}`, resolve),
  )
  echo('file', `renamed '${source}' as '${target}'`)
}

// export
export default main
