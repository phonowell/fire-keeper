import { describe, expect, it } from 'vitest'

import getFilename from '../src/getFilename.js'

describe('getFilename', () => {
  it('常规与特殊文件名', () => {
    expect(getFilename('path/to/file.txt')).toBe('file.txt')
    expect(getFilename('script.test.js')).toBe('script.test.js')
    expect(getFilename('demo.md')).toBe('demo.md')
    expect(getFilename('path/to/file name.txt')).toBe('file name.txt')
    expect(getFilename('path/to/文件.txt')).toBe('文件.txt')
    expect(getFilename('path/to/file@v1.0.txt')).toBe('file@v1.0.txt')
    expect(getFilename('path/to/123.txt')).toBe('123.txt')
    expect(getFilename('path/to/!@#.txt')).toBe('!@#.txt')
    expect(getFilename('path/to/fi$le.txt')).toBe('fi$le.txt')
    expect(getFilename('path/to/file(name).txt')).toBe('file(name).txt')
    expect(getFilename('path/to/file.')).toBe('file.')
    // 超长文件名
    const prefix = 'verylongfilename'
    const padLen = 256 - prefix.length - 4 // 4 for '.txt'
    const longName = `${prefix + 'a'.repeat(padLen)}.txt`
    expect(getFilename(`path/to/${longName}`)).toBe(longName)
    expect(getFilename('.gitignore')).toBe('.gitignore')
    expect(getFilename('.npmrc')).toBe('.npmrc')
    expect(getFilename('config/.gitignore')).toBe('.gitignore')
    expect(getFilename('a/.env')).toBe('.env')
    expect(getFilename('.env')).toBe('.env')
    expect(getFilename('.config/.env.local')).toBe('.env.local')
    expect(getFilename('.hiddenfile')).toBe('.hiddenfile')
    expect(getFilename('dir/.hidden')).toBe('.hidden')
    expect(getFilename('.ext')).toBe('.ext')
    expect(getFilename('noext')).toBe('noext')
  })

  it('目录、多斜杠与点路径', () => {
    expect(getFilename('path/to/dir/')).toBe('dir')
    expect(getFilename('folder/subfolder/')).toBe('subfolder')
    expect(getFilename('path/to/dir///')).toBe('dir')
    expect(getFilename('folder///')).toBe('folder')
    expect(getFilename('///a///b///c')).toBe('c')
    expect(getFilename('./file.txt')).toBe('file.txt')
    expect(getFilename('../file.txt')).toBe('file.txt')
    expect(getFilename('./')).toBe('.')
    expect(getFilename('/')).toBe('')
    expect(getFilename('.')).toBe('.')
    expect(getFilename('..')).toBe('..')
    expect(getFilename('...')).toBe('...')
    expect(getFilename('./.')).toBe('.')
    expect(getFilename('../..')).toBe('..')
    expect(getFilename('path/.')).toBe('.')
    expect(getFilename('path/..')).toBe('..')
    expect(getFilename('path/.hidden')).toBe('.hidden')
    expect(getFilename('path/')).toBe('path')
  })

  it('绝对路径与Windows路径', () => {
    expect(getFilename('/tmp/file.txt')).toBe('file.txt')
    expect(getFilename('/var/log/.env')).toBe('.env')
    expect(getFilename('C:\\path\\to\\file.txt')).toBe('file.txt')
    expect(getFilename('D:\\folder\\subfolder\\')).toBe('subfolder')
    expect(getFilename('C:\\')).toBe('C:')
    expect(getFilename('C:/')).toBe('C:')
    expect(getFilename('C:/Users/测试/桌面/文档.docx')).toBe('文档.docx')
    expect(getFilename('C:\\Users\\测试\\桌面\\文档.docx')).toBe('文档.docx')
    expect(getFilename('path\\to/mix\\slash.txt')).toBe('slash.txt')
    expect(getFilename('\\\\server\\share\\file.txt')).toBe('file.txt')
  })

  it('特殊字符与极端路径', () => {
    expect(getFilename('////a////')).toBe('a')
    expect(getFilename('////a////b////')).toBe('b')
    expect(getFilename('////a////b////c.txt')).toBe('c.txt')
    expect(getFilename('path/with space/文件@#￥%……&.md')).toBe(
      '文件@#￥%……&.md',
    )
    expect(getFilename('path/with_unicode/😀.txt')).toBe('😀.txt')
    expect(() => getFilename('')).toThrow()
  })
})
