import { exec, getBasename, glob, write } from '../src/index.js'

const main = async () => {
  if (!(await runTasks())) {
    console.error('Tests failed, aborting build.')
    return
  }

  await makeIndex()
  await exec('tsdown')
}

const makeIndex = async () => {
  const listModule = await makeListModule()

  const content = [
    ...listModule.map((it) => `import ${it} from './${it}.js'`),
    '',
    'export {',
    `  ${listModule.join(',\n  ')},`,
    '}',
    '',
  ].join('\n')

  await write('./src/index.ts', content)
}

const listModuleCache: string[] = []
const makeListModule = async () => {
  if (!listModuleCache.length) {
    listModuleCache.push(...(await glob(['./src/*.ts', '!**/index.ts'])).map(getBasename))
  }
  return listModuleCache
}

const runTasks = async () => {
  const [code] = await exec('pnpm test')
  return code === 0
}

export default main
