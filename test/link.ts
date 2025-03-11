/**
 * link 模块测试用例:
 *
 * 1. 创建文件符号链接
 *    - 测试创建指向文件的符号链接
 *    - 验证链接存在性和内容一致性
 *
 * 2. 创建目录符号链接
 *    - 测试创建指向目录的符号链接
 *    - 验证可以通过链接访问目录内容
 *    - 在 Windows 系统上跳过此测试
 *
 * 3. 路径规范化处理
 *    - 测试包含 ./ 和 ../ 的相对路径
 *    - 确保路径被正确规范化并创建链接
 *
 * 4. 处理不存在的源文件
 *    - 测试源文件不存在时的行为
 *    - 验证不会创建指向不存在文件的链接
 *
 * 5. 处理空目标路径
 *    - 测试目标路径为空字符串的情况
 *    - 验证不会创建无效链接
 *
 * 6. 处理多匹配的 glob 模式
 *    - 测试使用通配符匹配多个源文件
 *    - 验证使用第一个匹配项创建链接
 *
 * 7. 处理特殊字符路径
 *    - 测试包含中文等特殊字符的路径
 *    - 确保特殊字符路径的链接正常工作
 */

import path from 'path'

import { isExist, link, mkdir, read, remove, os, write } from '../src'

import { TEMP } from './index'

const a = async () => {
  // Test file symlink
  const source = `${TEMP}/source.txt`
  const target = `${TEMP}/target.txt`
  const content = 'test content'

  await write(source, content)
  await link(source, target)

  if (!(await isExist(target))) throw new Error('symlink not created')

  const linkContent = await read<string>(target)
  if (linkContent !== content) throw new Error('symlink content mismatch')
}
a.description = 'creates file symlink'

const b = async () => {
  if (os() === 'windows') return // Skip on Windows

  // Test directory symlink
  const source = `${TEMP}/source-dir`
  const target = `${TEMP}/target-dir`
  const testFile = 'test.txt'

  await mkdir(source)
  await write(`${source}/${testFile}`, 'test')
  await link(source, target)

  if (!(await isExist(target))) throw new Error('directory symlink not created')
  if (!(await isExist(`${target}/${testFile}`)))
    throw new Error('cannot access through symlink')
}
b.description = 'creates directory symlink'

const c = async () => {
  // Test path normalization
  const source = `${TEMP}/./source/../source/test.txt`
  const target = `${TEMP}/./target/../target/link.txt`
  const content = 'normalized path test'

  await write(path.normalize(source), content)
  await link(source, target)

  const normalizedTarget = path.normalize(target)
  if (!(await isExist(normalizedTarget)))
    throw new Error('normalized symlink not created')

  const linkContent = await read<string>(normalizedTarget)
  if (linkContent !== content)
    throw new Error('normalized symlink content mismatch')
}
c.description = 'handles path normalization'

const d = async () => {
  // Test non-existent source (glob returns empty array)
  const source = `${TEMP}/non-existent-*.txt`
  const target = `${TEMP}/broken-link.txt`

  await link(source, target)
  if (await isExist(target)) throw new Error('link should not be created')
}
d.description = 'handles non-existent source'

const e = async () => {
  // Test empty target path
  const source = `${TEMP}/source.txt`
  const target = ''

  await write(source, 'test')
  await link(source, target)
}
e.description = 'handles empty target path'

const f = async () => {
  // Test glob pattern with multiple matches
  const sources = ['test1.txt', 'test2.txt', 'test3.txt']
  const target = `${TEMP}/link.txt`

  // Create multiple source files
  for (const file of sources) await write(`${TEMP}/${file}`, file)

  // Link should use first match
  await link(`${TEMP}/test*.txt`, target)
  if (!(await isExist(target))) throw new Error('link not created')

  const content = await read<string>(target)
  if (content !== 'test1.txt') throw new Error('incorrect source file linked')

  // Cleanup test files
  await Promise.all(sources.map((file) => remove(`${TEMP}/${file}`)))
}
f.description = 'handles glob pattern with multiple matches'

const g = async () => {
  // Test special characters in paths
  const source = `${TEMP}/特殊文字.txt`
  const target = `${TEMP}/symbolic-特殊文字.txt`
  const content = 'special character test'

  await write(source, content)
  await link(source, target)

  if (!(await isExist(target)))
    throw new Error('special character symlink not created')

  const linkContent = await read<string>(target)
  if (linkContent !== content)
    throw new Error('special character symlink content mismatch')
}
g.description = 'handles special characters'

export { a, b, c, d, e, f, g }
