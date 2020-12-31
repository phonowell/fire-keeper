import $ from '../source'
import camelCase from 'lodash/camelCase'

// function

async function main_(): Promise<void> {
  await replace_()
  await replaceTest_()
}

async function pickModule_(): Promise<string> {

  const listModule = (await $.source_([
    './source/*.ts',
    '!**/index.ts',
  ]))
    .map(it => $.getBasename(it))

  return [
    ...listModule.map(it => `import ${camelCase(`m-${it}`)} from './${it}'`),
    'export default {',
    ...listModule.map(it => `  ${it}: ${camelCase(`m-${it}`)},`),
    '}',
  ].join('\n')
}

async function replace_(): Promise<void> {

  const content = [
    await pickModule_(),
    '',
    '// ---',
  ]
  const cont = (await $.read_('./source/index.ts') as string)
    .replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await $.write_('./source/index.ts', cont)
}

async function replaceTest_(): Promise<void> {

  const listModule = await $.source_([
    './test/*.ts',
    '!**/index.ts',
  ])

  // index.ts
  const listTest = listModule
    .map(it => $.getBasename(it))
  const content = [
    ...listTest.map(it => `import * as ${camelCase(`m-${it}`)} from './${it}'`),
    'const mapModule = {',
    ...listTest.map(it => `  ${it}: ${camelCase(`m-${it}`)},`),
    '}',
    '',
    '// ---',
  ]
  let cont = $.parseString(await $.read_('./test/index.ts'))
  cont = cont
    .replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await $.write_('./test/index.ts', cont)

  // module/*.ts
  await Promise.all(listModule.map(
    source => (async () => {

      const _cont = $.parseString(await $.read_(source))
      if (!~_cont.search(/throw\s\d/u)) return
      await $.write_(source, _cont
        // throw 0 -> throw new Error('0')
        .replace(/throw\s(\d+)/gu, "throw new Error('$1')")
      )
    })()
  ))
}

// export
export default main_
