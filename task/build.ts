import $ from '../source'
import camelCase from 'lodash/camelCase'

// function

const main = async (): Promise<void> => {
  await replace()
  await replaceTest()
}

const pickModule = async (): Promise<string> => {

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

const replace = async (): Promise<void> => {

  const content = [
    await pickModule(),
    '',
    '// ---',
  ]
  const cont = (await $.read_<string>('./source/index.ts'))
    .replace(/[\s\S]*\/\/\s---/u, content.join('\n'))
  await $.write_('./source/index.ts', cont)
}

const replaceTest = async (): Promise<void> => {

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
        .replace(/throw\s(\d+)/g, "throw new Error('$1')")
      )
    })()
  ))
}

// export
export default main
