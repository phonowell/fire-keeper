import { describe, expect, it } from 'vitest'

import getFilename from '../src/getFilename.js'

describe('getFilename', () => {
  it('应返回带扩展名的文件名', () => {
    expect(getFilename('path/to/file.txt')).toBe('file.txt')
    expect(getFilename('script.test.js')).toBe('script.test.js')
    expect(getFilename('demo.md')).toBe('demo.md')
  })

  it('应处理目录路径，返回目录名', () => {
    expect(getFilename('path/to/dir/')).toBe('dir')
    expect(getFilename('folder/subfolder/')).toBe('subfolder')
  })

  it('应处理特殊文件名', () => {
    expect(getFilename('.gitignore')).toBe('.gitignore')
    expect(getFilename('.npmrc')).toBe('.npmrc')
  })

  it('应处理带路径的特殊文件', () => {
    expect(getFilename('config/.gitignore')).toBe('.gitignore')
    expect(getFilename('a/.env')).toBe('.env')
  })

  it('应处理空字符串抛异常', () => {
    expect(() => getFilename('')).toThrow()
  })

  it('应处理路径结尾多个斜杠', () => {
    expect(getFilename('path/to/dir///')).toBe('dir')
    expect(getFilename('folder///')).toBe('folder')
  })

  it('应处理点目录和特殊路径', () => {
    expect(getFilename('./file.txt')).toBe('file.txt')
    expect(getFilename('../file.txt')).toBe('file.txt')
    expect(getFilename('./')).toBe('')
    expect(getFilename('/')).toBe('')
  })

  it('应处理复杂路径和特殊字符', () => {
    // 包含空格和特殊字符的文件名
    expect(getFilename('path/to/file name.txt')).toBe('file name.txt')
    expect(getFilename('path/to/文件.txt')).toBe('文件.txt')
    expect(getFilename('path/to/file@v1.0.txt')).toBe('file@v1.0.txt')

    // 绝对路径
    expect(getFilename('/tmp/file.txt')).toBe('file.txt')
    expect(getFilename('/var/log/.env')).toBe('.env')
    expect(getFilename('/')).toBe('')

    // Windows 路径
    expect(getFilename('C:\\path\\to\\file.txt')).toBe('file.txt')
    expect(getFilename('D:\\folder\\subfolder\\')).toBe('subfolder')
    expect(getFilename('C:\\')).toBe('')

    // 隐藏文件和特殊情况
    expect(getFilename('.env')).toBe('.env')
    expect(getFilename('.config/.env.local')).toBe('.env.local')
    expect(getFilename('path/to/file.')).toBe('file.')

    // 数字和特殊符号文件名
    expect(getFilename('path/to/123.txt')).toBe('123.txt')
    expect(getFilename('path/to/!@#.txt')).toBe('!@#.txt')
    expect(getFilename('path/to/fi$le.txt')).toBe('fi$le.txt')
    expect(getFilename('path/to/file(name).txt')).toBe('file(name).txt')
  })
})
