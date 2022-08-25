import $ from '../source'

// function

const main = async () => {
  const pkg = await $.read<{
    dependencies: Record<string, string> | null
    devDependencies: Record<string, string> | null
  }>('./package.json')

  const listCmd = [
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
  ].map(name => `pnpm i ${name}@latest`)

  await $.exec(listCmd)
}

// export
export default main
