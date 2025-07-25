import { describe, expect, it } from 'vitest'

import getName from '../src/getName.js'

import type { GetNameResult } from '../src/getName.js'

describe('getName', () => {
  it('应正确解析常规文件路径', () => {
    const cases: Array<[string, GetNameResult]> = [
      [
        'path/to/file.txt',
        {
          basename: 'file',
          dirname: 'path/to',
          extname: '.txt',
          filename: 'file.txt',
        },
      ],
      [
        'script.test.js',
        {
          basename: 'script.test',
          dirname: '.',
          extname: '.js',
          filename: 'script.test.js',
        },
      ],
      [
        'demo.md',
        { basename: 'demo', dirname: '.', extname: '.md', filename: 'demo.md' },
      ],
    ]
    cases.forEach(([input, expected]) => {
      expect(getName(input)).toEqual(expected)
    })
  })

  it('应正确解析目录路径', () => {
    const cases: Array<[string, GetNameResult]> = [
      [
        'path/to/dir/',
        { basename: 'dir', dirname: 'path/to', extname: '', filename: 'dir' },
      ],
      [
        'folder/subfolder/',
        {
          basename: 'subfolder',
          dirname: 'folder',
          extname: '',
          filename: 'subfolder',
        },
      ],
    ]
    cases.forEach(([input, expected]) => {
      expect(getName(input)).toEqual(expected)
    })
  })

  it('应正确解析特殊文件名', () => {
    const cases: Array<[string, GetNameResult]> = [
      [
        '.gitignore',
        {
          basename: '.gitignore',
          dirname: '.',
          extname: '',
          filename: '.gitignore',
        },
      ],
      [
        '.npmrc',
        { basename: '.npmrc', dirname: '.', extname: '', filename: '.npmrc' },
      ],
    ]
    cases.forEach(([input, expected]) => {
      expect(getName(input)).toEqual(expected)
    })
  })

  it('应正确解析带路径的特殊文件', () => {
    const cases: Array<[string, GetNameResult]> = [
      [
        'config/.gitignore',
        {
          basename: '.gitignore',
          dirname: 'config',
          extname: '',
          filename: '.gitignore',
        },
      ],
      [
        'a/.env',
        { basename: '.env', dirname: 'a', extname: '', filename: '.env' },
      ],
    ]
    cases.forEach(([input, expected]) => {
      expect(getName(input)).toEqual(expected)
    })
  })

  it('应正确解析根目录文件', () => {
    expect(getName('/file.txt')).toEqual({
      basename: 'file',
      dirname: '/',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应正确解析多级扩展名文件', () => {
    expect(getName('archive.tar.gz')).toEqual({
      basename: 'archive.tar',
      dirname: '.',
      extname: '.gz',
      filename: 'archive.tar.gz',
    })
  })

  it('应正确解析无扩展名文件', () => {
    expect(getName('README')).toEqual({
      basename: 'README',
      dirname: '.',
      extname: '',
      filename: 'README',
    })
  })

  it('应正确解析仅分隔符输入', () => {
    expect(getName('/')).toEqual({
      basename: '',
      dirname: '/',
      extname: '',
      filename: '',
    })
    expect(getName('\\')).toEqual({
      basename: '',
      dirname: '.',
      extname: '',
      filename: '',
    })
  })

  it('应正确解析路径中包含点的文件', () => {
    expect(getName('a.b/file.c.d')).toEqual({
      basename: 'file.c',
      dirname: 'a.b',
      extname: '.d',
      filename: 'file.c.d',
    })
  })

  it('应抛出空输入异常', () => {
    expect(() => getName('')).toThrowError(/empty input/)
  })

  it('应兼容 Windows 路径分隔符', () => {
    expect(getName('dir\\subdir\\file.js')).toEqual({
      basename: 'file',
      dirname: 'dir/subdir',
      extname: '.js',
      filename: 'file.js',
    })
  })

  it('应正确解析绝对 Windows 路径', () => {
    expect(getName('C:\\Users\\Admin\\file.txt')).toEqual({
      basename: 'file',
      dirname: 'C:/Users/Admin',
      extname: '.txt',
      filename: 'file.txt',
    })
  })

  it('应正确解析混合分隔符路径', () => {
    expect(getName('a\\b/c\\d.txt')).toEqual({
      basename: 'd',
      dirname: 'a/b/c',
      extname: '.txt',
      filename: 'd.txt',
    })
  })

  it('应正确解析带空格和特殊字符的路径', () => {
    expect(getName('dir/子目录/fi le@.js')).toEqual({
      basename: 'fi le@',
      dirname: 'dir/子目录',
      extname: '.js',
      filename: 'fi le@.js',
    })
  })

  it('应正确解析边界和特殊路径', () => {
    // 极长路径
    const longName = `${'a'.repeat(255)}.txt`
    expect(getName(`dir/${longName}`)).toEqual({
      basename: 'a'.repeat(255),
      dirname: 'dir',
      extname: '.txt',
      filename: `${'a'.repeat(255)}.txt`,
    })

    // 仅扩展名文件
    expect(getName('.env')).toEqual({
      basename: '.env',
      dirname: '.',
      extname: '',
      filename: '.env',
    })

    // 路径末尾多个分隔符
    expect(getName('dir/subdir///')).toEqual({
      basename: 'subdir',
      dirname: 'dir',
      extname: '',
      filename: 'subdir',
    })

    // 当前和上级目录路径
    expect(getName('.')).toEqual({
      basename: '.',
      dirname: '.',
      extname: '',
      filename: '.',
    })

    expect(getName('..')).toEqual({
      basename: '..',
      dirname: '.',
      extname: '',
      filename: '..',
    })

    // 网络路径
    expect(getName('file:///a/b.txt')).toEqual({
      basename: 'b',
      dirname: 'file:///a',
      extname: '.txt',
      filename: 'b.txt',
    })
  })
})
