import { describe, expect, it } from 'vitest'

import getExtname from '../src/getExtname.js'

describe('getExtname', () => {
  it('应返回常规扩展名（带点）', () => {
    expect(getExtname('file.txt')).toBe('.txt')
    expect(getExtname('a/b/c/script.js')).toBe('.js')
    expect(getExtname('demo.md')).toBe('.md')
  })

  it('应处理多重扩展名，仅返回最后一个', () => {
    expect(getExtname('archive.tar.gz')).toBe('.gz')
    expect(getExtname('bundle.min.js')).toBe('.js')
    expect(getExtname('script.test.ts')).toBe('.ts')
  })

  it('应处理无扩展名文件', () => {
    expect(getExtname('README')).toBe('')
    expect(getExtname('no-extension')).toBe('')
  })

  it('应处理特殊文件名', () => {
    expect(getExtname('.gitignore')).toBe('')
    expect(getExtname('.npmrc')).toBe('')
  })

  it('应处理带路径的特殊文件', () => {
    expect(getExtname('config/.gitignore')).toBe('')
    expect(getExtname('folder/.env')).toBe('')
  })

  it('应处理空字符串抛异常', () => {
    expect(() => getExtname('')).toThrow()
  })

  it('应处理 Windows 路径分隔符', () => {
    expect(getExtname('C:\\path\\to\\file.txt')).toBe('.txt')
    expect(getExtname('C:\\path\\to\\.gitignore')).toBe('')
  })

  it('应处理隐藏文件带扩展名', () => {
    expect(getExtname('.env.local')).toBe('.local')
    expect(getExtname('.config.json')).toBe('.json')
  })

  it('应处理目录结尾', () => {
    expect(getExtname('folder/')).toBe('')
    expect(getExtname('folder.sub/')).toBe('')
  })

  it('应处理仅扩展名文件', () => {
    expect(getExtname('.bashrc')).toBe('')
    expect(getExtname('.profile')).toBe('')
  })

  it('应处理多点文件名', () => {
    expect(getExtname('a.b.c.d')).toBe('.d')
    expect(getExtname('multi.part.name.ext')).toBe('.ext')
  })

  it('应处理带空格和特殊字符的文件名', () => {
    expect(getExtname('my file.txt')).toBe('.txt')
    expect(getExtname('weird@file!.md')).toBe('.md')
    expect(getExtname('空格 .js')).toBe('.js')
    expect(getExtname('特殊字符#$.json')).toBe('.json')
  })

  it('应处理复杂路径场景', () => {
    // 极长文件名
    const longName = `${'a'.repeat(255)}.ext`
    expect(getExtname(longName)).toBe('.ext')

    // 文件夹名带点但无扩展
    expect(getExtname('folder.name/')).toBe('')
    expect(getExtname('folder.name/file')).toBe('')

    // 非 UTF-8 字符文件名
    expect(getExtname('文件名.测试')).toBe('.测试')
    expect(getExtname('файл.тест')).toBe('.тест')
  })
})
