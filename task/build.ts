import { argv, getBasename, glob, move, read, remove, write } from '../source'

// function

const main = async () => {
  const step = argv()._[1] as 0 | 1

  if (step === 0) {
    await makeIndex()
    await replaceRollup()
    await replaceTest()
  }

  if (step === 1) {
    await moveType()
  }
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

  await write('./source/index.ts', content)
}

const makeListModule = async () =>
  (await glob(['./source/*.ts', '!**/index.ts'])).map(getBasename)

const moveType = async () => {
  await move('./dist/source/*.d.ts', './dist')
  await move('./dist/esm/source/*.d.ts', './dist/esm')
  await remove([
    './dist/source',
    './dist/task',
    './dist/test',
    './dist/rollup.config.d.ts',
    './dist/esm/source',
    './dist/esm/task',
    './dist/esm/test',
    './dist/esm/rollup.config.d.ts',
  ])
}

const replaceRollup = async () => {
  const listModule = await makeListModule()
  listModule.push('index')

  const source = './rollup.config.ts'
  const cont = await read(source)
  if (!cont) return

  const content = cont.replace(
    /const input = {[\s\S]*?}/,
    `const input = {\n${listModule
      .map(it => `  ${it}: 'source/${it}.ts',`)
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
    "import * as $ from '../source/index'",
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
