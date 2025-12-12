import { echo, exec } from '../src/index.js'

/**
 * 检查当前分支是否为主分支
 */
const checkBranch = async (): Promise<boolean> => {
  const [, stdout] = await exec('git rev-parse --abbrev-ref HEAD')
  const currentBranch = stdout.trim()

  if (currentBranch !== 'main') {
    echo('publish', `error: not on main branch (current: ${currentBranch})`)
    return false
  }

  echo('publish', 'branch check passed: on main branch')
  return true
}

/**
 * 检查工作区是否干净（没有未提交的更改）
 */
const checkWorkingDirectory = async (): Promise<boolean> => {
  const [, stdout] = await exec('git status --porcelain')

  if (stdout.trim()) {
    echo('publish', 'error: working directory is not clean')
    echo('publish', 'please commit or stash your changes first')
    return false
  }

  echo('publish', 'working directory check passed: clean')
  return true
}

/**
 * 检查本地分支是否与远程同步
 */
const checkRemoteSync = async (): Promise<boolean> => {
  // 获取远程最新状态
  await exec('git fetch')

  // 检查本地是否落后于远程
  const [, behind] = await exec('git rev-list HEAD..origin/main --count')
  if (parseInt(behind.trim()) > 0) {
    echo('publish', 'error: local branch is behind remote')
    echo('publish', 'please pull the latest changes first')
    return false
  }

  // 检查本地是否领先于远程
  const [, ahead] = await exec('git rev-list origin/main..HEAD --count')
  if (parseInt(ahead.trim()) > 0) {
    echo('publish', 'error: local branch is ahead of remote')
    echo('publish', 'please push your commits first')
    return false
  }

  echo('publish', 'remote sync check passed: in sync with origin/main')
  return true
}

/**
 * 更新版本号并创建 git 标签
 */
const updateVersion = async (): Promise<boolean> => {
  echo('publish', 'updating version with npm version patch...')

  const [code] = await exec('npm version patch')

  if (code !== 0) {
    echo('publish', 'error: npm version patch failed')
    return false
  }

  echo('publish', 'version updated successfully')
  return true
}

/**
 * 推送提交和标签到远程
 */
const pushToRemote = async (): Promise<boolean> => {
  echo('publish', 'pushing commits to remote...')

  const [code1] = await exec('git push')
  if (code1 !== 0) {
    echo('publish', 'error: git push failed')
    return false
  }

  echo('publish', 'pushing tags to remote...')

  const [code2] = await exec('git push --tags')
  if (code2 !== 0) {
    echo('publish', 'error: git push --tags failed')
    return false
  }

  echo('publish', 'pushed to remote successfully')
  return true
}

/**
 * 发布到 npm
 */
const publishToNpm = async (): Promise<boolean> => {
  echo('publish', 'publishing to npm...')

  const [code] = await exec('npm publish')

  if (code !== 0) {
    echo('publish', 'error: npm publish failed')
    return false
  }

  echo('publish', 'published to npm successfully')
  return true
}

/**
 * 主函数
 */
const main = async () => {
  echo('publish', 'starting publish workflow...')

  // 1. 检查分支
  if (!(await checkBranch())) return

  // 2. 检查工作区
  if (!(await checkWorkingDirectory())) return

  // 3. 检查远程同步
  if (!(await checkRemoteSync())) return

  // 4. 更新版本
  if (!(await updateVersion())) return

  // 5. 推送到远程
  if (!(await pushToRemote())) return

  // 6. 发布到 npm
  if (!(await publishToNpm())) return

  echo('publish', 'publish workflow completed successfully!')
}

export default main
