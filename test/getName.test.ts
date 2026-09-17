import { describe, expect, it } from 'vitest'

import getName from '../src/getName.js'

describe('getName', () => {
  it('应正确解析常规文件路径', () => {
    expect(getName('path/to/file.txt')).toEqual({
      basename: 'file',
      dirname: 'path/to',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应抛出空输入异常', () => {
    expect(() => getName('')).toThrowError(/empty input/)
  })

  it('应正确解析多级扩展名文件', () => {
    expect(getName('archive.tar.gz')).toEqual({
      basename: 'archive.tar',
      dirname: '.',
      extname: '.gz',
      filename: 'archive.tar.gz',
    })
  })

  it('应将反斜杠路径规范化为正斜杠', () => {
    expect(getName('dir\\sub\\file.txt')).toEqual({
      basename: 'file',
      dirname: 'dir/sub',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应解析尾部斜杠的目录路径', () => {
    expect(getName('dir/sub/')).toEqual({
      basename: 'sub',
      dirname: 'dir',
      extname: '',
      filename: 'sub',
    })
  })

  it('应为 UNC 路径保留尾部斜杠', () => {
    expect(getName('//server/share/file.txt')).toEqual({
      basename: 'file',
      dirname: '//server/share/',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应正确解析隐藏文件', () => {
    expect(getName('.gitignore')).toEqual({
      basename: '.gitignore',
      dirname: '.',
      extname: '',
      filename: '.gitignore',
    })
    expect(getName('.eslintrc.json')).toEqual({
      basename: '.eslintrc',
      dirname: '.',
      extname: '.json',
      filename: '.eslintrc.json',
    })
  })

  it('应解析根路径与单文件名', () => {
    expect(getName('/')).toEqual({
      basename: '',
      dirname: '/',
      extname: '',
      filename: '',
    })
    expect(getName('file')).toEqual({
      basename: 'file',
      dirname: '.',
      extname: '',
      filename: 'file',
    })
  })

  it('应处理含空格与 Unicode 的路径', () => {
    expect(getName('我的 文件/数据 表.csv')).toEqual({
      basename: '数据 表',
      dirname: '我的 文件',
      extname: '.csv',
      filename: '数据 表.csv',
    })
  })

  it('应将结尾点号视为扩展名', () => {
    expect(getName('file.')).toEqual({
      basename: 'file',
      dirname: '.',
      extname: '.',
      filename: 'file.',
    })
  })
})
