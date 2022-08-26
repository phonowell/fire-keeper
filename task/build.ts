import $ from '../source/index'

// interface

type ListTs = `${string}.ts`[]

// function

const main = async () => {
  await replace()
  await replaceRollup()
  await replaceTest()
}

const pickModule = async (): Promise<string> => {
  const listModule = (await $.glob(['./source/*.ts', '!**/index.ts'])).map(
    $.getBasename
  )

  return [
    ...listModule.map(it => `import ${it} from './${it}'`),
    'const $ = {',
    `  ${listModule.join(', ')},`,
    '}',
    'export default $',
  ].join('\n')
}

const replace = async () => {
  const content = [await pickModule(), '', '// ---']
  const cont = (await $.read<string>('./source/index.ts')).replace(
    /[\s\S]*\/\/\s---/u,
    content.join('\n')
  )
  await $.write('./source/index.ts', cont)
}

const replaceRollup = async () => {
  const listModule = (await $.glob('./source/*.ts')).map($.getBasename)
  const source = './rollup.config.js'
  const cont = await $.read(source)
  if (!cont) return
  const content = cont.replace(
    /input: {.*?}/,
    `input: { ${listModule.map(it => `${it}: 'source/${it}.ts'`).join(', ')} }`
  )
  await $.write(source, content)
}

const replaceTest = async () => {
  const listModule = (await $.glob(['./test/*.ts', '!**/index.ts'])) as ListTs

  const listTest = listModule.map($.getBasename) as ListTs
  const content = [
    ...listTest.map(it => `import * as ${it} from './${it}'`),
    "import { describe, it } from 'mocha'",
    "import $ from '../source/index'",
    'const mapModule = {',
    `  ${listTest.join(', ')},`,
    '}',
    '',
    '// ---',
  ]

  const contIndex = await $.read('./test/index.ts')
  if (!contIndex) return
  const contIndex2 = contIndex.replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await $.write('./test/index.ts', contIndex2)
}

// export
export default main
