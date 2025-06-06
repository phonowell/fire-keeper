import { glob, read, write } from '../src'

const main = async () => {
  const listSource = await glob([
    './*.js',
    './*.ts',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
    './task/*.ts',
    './test/*.ts',
  ])
  for (const source of listSource) {
    const content = await read<string>(source)
    if (!content) continue
    const cont = content.replace(/\r/g, '')
    if (cont === content) continue
    await write(source, cont)
  }
}

export default main
