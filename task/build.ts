import { exec, getBasename, glob, read, remove, write } from '../src/index.js'

const main = async () => {
  await cleanup()
  await makeIndex()
  await replacePackage()
  await replaceRollup()
  await generateDocs()
}

const cleanup = () => remove('./dist')

const generateDocs = () => exec('pnpm doc')

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
    listModuleCache.push(
      ...(await glob(['./src/*.ts', '!**/index.ts'])).map(getBasename),
    )
  }
  return listModuleCache
}

const replacePackage = async () => {
  const pkg = await read<{
    exports?: Record<
      string,
      {
        import: string
        require: string
      }
    >
  }>('./package.json')
  if (!pkg) return

  const exports: NonNullable<(typeof pkg)['exports']> = {
    '.': {
      import: './dist/index.js',
      require: './dist/cjs/index.js',
    },
  }
  const listModule = await makeListModule()
  for (const it of listModule) {
    exports[`./${it}`] = {
      import: `./dist/${it}.js`,
      require: `./dist/cjs/${it}.js`,
    }
  }
  pkg.exports = exports

  await write('./package.json', JSON.stringify(pkg, null, 2))
}

const replaceRollup = async () => {
  const listModule = await makeListModule()
  listModule.push('index')

  const source = './rollup.config.js'
  const cont = await read(source)
  if (!cont) return

  const content = cont.replace(
    /const input = {[\s\S]*?}/,
    `const input = {\n${listModule
      .map((it) => `  ${it}: 'src/${it}.ts',`)
      .join('\n')}\n}`,
  )
  await write(source, content)
}

export default main
