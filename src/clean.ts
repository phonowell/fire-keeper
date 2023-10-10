import getDirname from './getDirname'
import glob from './glob'
import remove from './remove'

// function

const main = async (source: string | string[]) => {
  const listSource = await glob(source, { onlyFiles: false })
  await remove(source)
  const dirname = getDirname(listSource[0])
  if ((await glob(`${dirname}/**/*`)).length) return
  await remove(dirname)
}

// export
export default main
