import { describe, expect, it } from 'vitest'

import getDirname from '../src/getDirname.js'

describe('getDirname', () => {
  it('常规路径与当前目录', () => {
    expect(getDirname('path/to/file.txt')).toBe('path/to')
    expect(getDirname('a/b/c/script.js')).toBe('a/b/c')
    expect(getDirname('demo.md')).toBe('.')
    expect(getDirname('./config.json')).toBe('.')
    expect(getDirname('file.js')).toBe('.')
    expect(getDirname('.gitignore')).toBe('.')
    expect(getDirname('.env')).toBe('.')
  })

  it('跨平台路径', () => {
    expect(getDirname('C:\\path\\file.txt')).toBe('C:/path')
    expect(getDirname('D:\\a\\b\\c.txt')).toBe('D:/a/b')
    expect(getDirname('C:/root/file.txt')).toBe('C:/root')
    expect(getDirname('C:/file.txt')).toBe('C:')
  })

  it('结尾斜杠与根目录', () => {
    expect(getDirname('a/b/c/')).toBe('a/b')
    expect(getDirname('/')).toBe('/')
    expect(getDirname('C:/')).toBe('C:/')
  })

  it('隐藏文件夹与多重扩展名', () => {
    expect(getDirname('.config/file')).toBe('.config')
    expect(getDirname('a.b.c/file.tar.gz')).toBe('a.b.c')
  })

  it('空字符串应抛异常', () => {
    expect(() => getDirname('')).toThrow()
  })

  it('特殊路径场景', () => {
    // 极长路径
    const longPath = `${'a/'.repeat(50)}file.txt`
    expect(getDirname(longPath)).toBe('a/'.repeat(50).slice(0, -1))

    // 包含空格
    expect(getDirname('dir with space/file.txt')).toBe('dir with space')

    // 包含中文
    expect(getDirname('测试目录/文件.txt')).toBe('测试目录')

    // 包含特殊符号
    expect(getDirname('a-b_c.d/e@f#g.txt')).toBe('a-b_c.d')

    // 仅扩展名
    expect(getDirname('.txt')).toBe('.')

    // 相对路径标识符
    expect(getDirname('.')).toBe('.')
    expect(getDirname('..')).toBe('.')
  })
})
