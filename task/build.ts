import { getBasename, glob, read, remove, write } from '../src'

const main = async () => {
  await cleanup()
  await makeIndex()
  await replaceRollup()
  await replaceTest()
}

const cleanup = () => remove('./dist')

const makeIndex = async () => {
  const listModule = await makeListModule()

  const content = [
    ...listModule.map(it => `import ${it} from './${it}'`),
    '',
    'export {',
    `  ${listModule.join(',\n  ')},`,
    '}',
    '',
  ].join('\n')

  await write('./src/index.ts', content)
}

const makeListModule = async () =>
  (await glob(['./src/*.ts', '!**/index.ts'])).map(getBasename)

const replaceRollup = async () => {
  const listModule = await makeListModule()
  listModule.push('index')

  const source = './rollup.config.ts'
  const cont = await read(source)
  if (!cont) return

  const content = cont.replace(
    /const input = {[\s\S]*?}/,
    `const input = {\n${listModule
      .map(it => `  ${it}: 'src/${it}.ts',`)
      .join('\n')}\n}`,
  )
  await write(source, content)
}

const replaceTest = async () => {
  const listModule = (await glob(['./test/*.ts', '!**/index.ts'])).map(
    getBasename,
  )

  const listTest = listModule.map(getBasename)
  const content = [
    "import { describe, it } from 'mocha'",
    '',
    "import { argv, echo, normalizePath, remove } from '../src'",
    '',
    ...listTest.map(it => `import * as ${it}Tests from './${it}'`),
    '',
    'const mapModule = {',
    ...listTest.map(it => `  ${it}: ${it}Tests,`),
    '}',
    '',
    '// ---',
  ]

  const contIndex = await read('./test/index.ts')
  if (!contIndex) return
  const contIndex2 = contIndex.replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await write('./test/index.ts', contIndex2)
}

export default main
