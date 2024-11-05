import { echo, exec, read } from 'fire-keeper'

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

type DependencyInfo = {
  current: string
  latest: string
  wanted: string
  isDeprecated: boolean
  dependencyType: 'dependencies' | 'devDependencies'
}

/**
 * 获取锁定版本的依赖列表
 * @returns 锁定版本的依赖名称数组
 */
const getLockedDependencies = async (): Promise<string[]> => {
  const pkg = await read<PackageJson>('./package.json')
  if (!pkg) return []

  const lockedDeps = [
    ...Object.entries(pkg.dependencies ?? {}),
    ...Object.entries(pkg.devDependencies ?? {}),
  ]
    .filter((it) => !Number.isNaN(Number(it[1][0])))
    .map((it) => it[0])
    .sort()

  return lockedDeps
}

/**
 * 更新项目依赖
 */
const updateDependencies = async () => {
  const [, raw] = await exec('pnpm outdated --json')
  const result = JSON.parse(raw) as Record<string, DependencyInfo>

  const lockedDeps = await getLockedDependencies()
  const depsToUpdate = Object.entries(result)
    .filter(([name, data]) => {
      if (data.isDeprecated) return false
      if (lockedDeps.includes(name)) return false
      if (name.endsWith('react') || name.endsWith('react-dom')) return false
      return true
    })
    .map(([name]) => name)

  if (depsToUpdate.length) {
    const updateCommands = depsToUpdate.map((name) => `pnpm i ${name}@latest`)
    await exec([...updateCommands])
  }

  echo(['These dependencies have been locked:', ...lockedDeps].join('\n'))
}

/**
 * 主函数：执行依赖更新
 */
const main = async () => {
  await updateDependencies()
}

export default main
