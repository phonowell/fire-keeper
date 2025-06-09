import { echo, exec, read } from '../src/index.js'

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const getAllDependencies = async () => {
  const pkg = await read<PackageJson>('./package.json')
  if (!pkg) return []

  const deps = [
    ...Object.entries(pkg.dependencies ?? {}),
    ...Object.entries(pkg.devDependencies ?? {}),
  ]

  return deps
}

const updateDependencies = async () => {
  const deps = await getAllDependencies()

  const lockedDeps = deps.filter(
    ([, version]) => !Number.isNaN(Number(version[0])),
  )
  const unlockedDeps = deps.filter(([, version]) =>
    Number.isNaN(Number(version[0])),
  )

  const depsToUpdate = unlockedDeps
    .filter(([name]) => {
      if (name.endsWith('react') || name.endsWith('react-dom')) return false
      return true
    })
    .map(([name]) => name)

  if (depsToUpdate.length) {
    const list = depsToUpdate.map((name) => `${name}@latest`).join(' ')
    await exec(`pnpm install ${list}`)
  }

  echo(
    [
      'These dependencies have been locked:',
      ...lockedDeps.map((it) => `'${it.join('@')}'`),
    ].join('\n'),
  )
}

const main = async () => {
  await updateDependencies()
}

export default main
