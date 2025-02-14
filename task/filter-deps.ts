import { echo, glob, read } from 'fire-keeper'

const LIST_EXCLUDE_EXACT = [
  '@bilibili-firebird/activity-utils',
  '@bilibili-firebird/lib.activity-fetcher',
  '@bilibili-firebird/lib.activity-logger',
  '@bilibili-firebird/lib.apollo',
  '@bilibili-firebird/lib.app-caller',
  '@bilibili-firebird/lib.bridge',
  '@bilibili-firebird/lib.environment',
  '@bilibili-firebird/rollup-plugin-tinypng',
  '@bilibili-firebird/svga-plus',
  '@bilibili-firebird/vite-plugin-codeblock',
  '@bilibili/activity',
  '@bilibili/bili-mirror',
  '@bilibili/js-bridge',
  '@plat-components/h5-manga-base',
  '@types/node',
  'autoprefixer',
  'axios',
  'classnames',
  'dayjs',
  'fire-compiler',
  'fire-keeper',
  'nib',
  'page-lifecycle',
  'postcss',
  'prettier',
  'radash',
  'react',
  'react-dom',
  'rollup',
  'rollup-plugin-visualizer',
  'stylus',
  'swr',
  'terser',
  'ts-node',
  'tslib',
  'typescript',
  'vite',
]

const LIST_EXCLUDE_INCLUDE = [
  '@apollo',
  '@graphql',
  '@swc',
  '@vitejs',
  'eslint',
]

const fetchFileContents = () =>
  echo.whisper(async () => {
    const filePaths = await glob([
      '!./node_modules/**',
      './rollup.config.ts',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.ts',
      './src/**/*.tsx',
      './task/**/*.ts',
    ])

    const fileContents: string[] = []
    for (const source of filePaths) {
      const content = await read<string>(source)
      if (!content) continue
      fileContents.push(content)
    }

    return fileContents
  })

const fetchDependencies = async () => {
  const packageJson = await read<{
    dependencies: Record<string, string> | undefined
    devDependencies: Record<string, string> | undefined
  }>('./package.json')
  if (!packageJson) return []

  const dependencies = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]

  const filteredDependencies = dependencies
    .filter(
      dep =>
        !(
          dep.startsWith('@types/') &&
          dependencies.includes(dep.replace('@types/', ''))
        ),
    )
    .filter(dep => !LIST_EXCLUDE_EXACT.includes(dep))
    .filter(dep => !LIST_EXCLUDE_INCLUDE.some(it => dep.includes(it)))

  return filteredDependencies
}

const main = async () => {
  const allFileContents = (await fetchFileContents()).join('\n')
  const dependencies = await fetchDependencies()

  const unusedDependencies = dependencies.filter(
    dep =>
      !allFileContents.includes(` from '${dep}`) &&
      !allFileContents.includes(` from "${dep}`) &&
      !allFileContents.includes(`import('${dep}`),
  )

  if (!unusedDependencies.length) {
    console.log('No unused dependencies found')
    return
  }
  console.log(`pnpm rm ${unusedDependencies.join(' ')}`)
}

export default main
