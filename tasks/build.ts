import { exec, getBasename, glob, read, write } from '../src/index.js'

const main = async () => {
  if (!(await runTasks())) {
    console.error('Tests failed, aborting build.')
    return
  }

  await makeIndex()
  await exec('tsdown')
  await makeApiDoc()
}

const makeApiDoc = async () => {
  const listModule = [...(await makeListModule())].sort()
  const sections = [
    '# fire-keeper API',
    '',
    '> Auto-generated from `src/*.ts` JSDoc. Do not edit.',
    '',
  ]

  for (const mod of listModule) {
    const content = await read<string>(`./src/${mod}.ts`)
    if (!content) continue

    const docs = (content.match(/^\/\*\*[\s\S]*?^\s*\*\//gm) ?? [])
      .map((block) =>
        block
          .replace(/^\/\*\*|\*\/$/g, '')
          .split('\n')
          .map((line) => line.replace(/^\s*\* ?/, ''))
          .join('\n')
          .trim(),
      )
      .filter(Boolean)
    if (!docs.length) continue

    sections.push(`## ${mod}`, '', docs.join('\n\n'), '')
  }

  await write('./dist/api.md', sections.join('\n'))
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
