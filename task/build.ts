import { exec, getBasename, glob, read, write } from '../src'

// function

const main = async () => {
  await makeIndex()
  await replaceRollup()
  await replaceTest()
  await exec('open ./stats.html')
}

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
    ...listTest.map(it => `import * as ${it} from './${it}'`),
    "import { describe, it } from 'mocha'",
    "import * as $ from '../src/index'",
    'const mapModule = {',
    `  ${listTest.join(', ')},`,
    '}',
    '',
    '// ---',
  ]

  const contIndex = await read('./test/index.ts')
  if (!contIndex) return
  const contIndex2 = contIndex.replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await write('./test/index.ts', contIndex2)
}

// export
export default main
