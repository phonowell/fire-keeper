import $ from '../source'
// import $ from '../lib/fire-keeper'

// function

async function main_(): Promise<void> {
  await replace_()
  await replaceTest_()
}

async function pickModule_(): Promise<string> {

  const listModule = (await $.source_('./source/module/*.ts'))
    .map(it => $.getBasename(it))
  return [
    ...listModule.map(it => `import __module_${it}__ from './module/${it}'`),
    'const $ = {} as {',
    ...listModule.map(it => `  ${it}: typeof __module_${it}__`),
    '}',
    'const listModule = [',
    ...listModule.map((it, i) => `  '${it}'${
      i === listModule.length - 1 ? '' : ','
      }`),
    ']'
  ].join('\n')
}

async function pickTask_(): Promise<string> {

  const listTask = (await $.source_('./source/task/*.ts'))
    .map(it => $.getBasename(it))
  return [
    'const listTask = [',
    ...listTask.map((it, i) => `  '${it}'${
      i === listTask.length - 1 ? '' : ','
      }`),
    ']'
  ].join('\n')
}

async function replace_(): Promise<void> {

  const content = [
    await pickModule_(),
    await pickTask_(),
    '',
    '// ---'
  ]
  const cont = (await $.read_('./source/index.ts') as string)
    .replace(/[\s\S]*\/\/\s---/, content.join('\n'))
  await $.write_('./source/index.ts', cont)
}

async function replaceTest_(): Promise<void> {

  const listModule = await $.source_('./test/module/*.ts')

  // index.ts
  const listTest = listModule
    .map(it => $.getBasename(it))
  const content = [
    ...listTest.map(it => `import * as __module_${it}__ from './module/${it}'`),
    'const mapModule = {',
    ...listTest.map((it, i) => `  ${it}: __module_${it}__${
      i === listTest.length - 1 ? '' : ','
      }`),
    '}',
    '',
    '// ---'
  ]
  let cont = $.parseString(await $.read_('./test/index.ts'))
  cont = cont
    .replace(/[\s\S]*\/\/\s---/, content.join('\n'))
  await $.write_('./test/index.ts', cont)

  // module/*.ts
  for (const source of listModule) {
    const cont = $.parseString(await $.read_(source))
    if (!~cont.search(/throw\s\d/)) continue
    await $.write_(source, cont
      // throw 0 -> throw new Error('0')
      .replace(/throw\s(\d+)/g, "throw new Error('$1')")
    )
  }
}

// export
export default main_