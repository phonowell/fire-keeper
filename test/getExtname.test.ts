import { describe, expect, it } from 'vitest'

import getExtname from '../src/getExtname.js'

describe('getExtname', () => {
  it('常规扩展名与多重扩展名', () => {
    expect(getExtname('file.txt')).toBe('.txt')
    expect(getExtname('a/b/c/script.js')).toBe('.js')
    expect(getExtname('archive.tar.gz')).toBe('.gz')
    expect(getExtname('bundle.min.js')).toBe('.js')
    expect(getExtname('script.test.ts')).toBe('.ts')
    expect(getExtname('demo.md')).toBe('.md')
  })

  it('无扩展名与特殊文件名', () => {
    expect(getExtname('README')).toBe('')
    expect(getExtname('no-extension')).toBe('')
    expect(getExtname('.gitignore')).toBe('')
    expect(getExtname('.npmrc')).toBe('')
    expect(getExtname('.bashrc')).toBe('')
    expect(getExtname('.profile')).toBe('')
  })

  it('带路径的特殊文件', () => {
    expect(getExtname('config/.gitignore')).toBe('')
    expect(getExtname('folder/.env')).toBe('')
    expect(getExtname('folder/')).toBe('')
    expect(getExtname('folder.sub/')).toBe('.sub')
    expect(getExtname('folder.name/')).toBe('.name')
    expect(getExtname('folder.name/file')).toBe('')
  })

  it('隐藏文件带扩展名', () => {
    expect(getExtname('.env.local')).toBe('.local')
    expect(getExtname('.config.json')).toBe('.json')
  })

  it('Windows 路径分隔符', () => {
    expect(getExtname('C:\\path\\to\\file.txt')).toBe('.txt')
    expect(getExtname('C:\\path\\to\\.gitignore')).toBe('')
  })

  it('多点文件名与特殊字符', () => {
    expect(getExtname('a.b.c.d')).toBe('.d')
    expect(getExtname('multi.part.name.ext')).toBe('.ext')
    expect(getExtname('my file.txt')).toBe('.txt')
    expect(getExtname('weird@file!.md')).toBe('.md')
    expect(getExtname('空格 .js')).toBe('.js')
    expect(getExtname('特殊字符#$.json')).toBe('.json')
  })

  it('极端与非 UTF-8 字符', () => {
    const longName = `${'a'.repeat(255)}.ext`
    expect(getExtname(longName)).toBe('.ext')
    expect(getExtname('文件名.测试')).toBe('.测试')
  })

  it('空字符串抛异常', () => {
    expect(() => getExtname('')).toThrow()
  })
})
