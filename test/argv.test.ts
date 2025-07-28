import { afterEach, describe, expect, it } from 'vitest'

import argv from '../src/argv.js'

type ArgvResult = {
  [x: string]:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | (string | number)[]
    | undefined
  _: (string | number)[]
  $0: string
}

describe('argv', () => {
  const OLD_ARGV = process.argv

  afterEach(() => {
    process.argv = OLD_ARGV
  })

  it('解析命名参数', async () => {
    process.argv = ['node', 'script.js', '--name=张三', '--age=18']
    const args = (await argv()) as ArgvResult
    expect(args.name).toBe('张三')
    expect(args.age).toBe(18)
  })

  it('解析位置参数', async () => {
    process.argv = ['node', 'script.js', 'file1.txt', 'file2.txt']
    const args = (await argv()) as ArgvResult
    expect(args._).toEqual(['file1.txt', 'file2.txt'])
  })

  it('解析布尔参数', async () => {
    process.argv = ['node', 'script.js', '--flag']
    const args = (await argv()) as ArgvResult
    expect(args.flag).toBe(true)
  })

  it('$0 字段为脚本名', async () => {
    process.argv = ['node', 'myScript.js']
    const args = (await argv()) as ArgvResult
    expect(args.$0).toBe('myScript.js')
  })

  it('混合参数', async () => {
    process.argv = [
      'node',
      'script.js',
      '--name=李四',
      'file.txt',
      '--flag',
      '--age=20',
    ]
    const args = (await argv()) as ArgvResult
    expect(args.name).toBe('李四')
    expect(args.flag).toBe(true)
    expect(args.age).toBe(20)
    expect(args._).toEqual(['file.txt'])
  })

  it('重复参数为数组', async () => {
    process.argv = ['node', 'script.js', '--list=a', '--list=b']
    const args = (await argv()) as ArgvResult
    expect(args.list).toEqual(['a', 'b'])
  })

  it('短参数', async () => {
    process.argv = ['node', 'script.js', '-f', 'file.txt']
    const args = (await argv()) as ArgvResult
    expect(args.f).toBe('file.txt')
    expect(args._).toEqual([])
  })

  it('数字参数', async () => {
    process.argv = ['node', 'script.js', '--num=42']
    const args = (await argv()) as ArgvResult
    expect(args.num).toBe(42)
  })

  it('无参数情况', async () => {
    process.argv = ['node', 'script.js']
    const args = (await argv()) as ArgvResult
    expect(args._).toEqual([])
    expect(args.$0).toBe('script.js')
  })

  it('参数为文件路径', async () => {
    const testFilePath = './package.json'
    process.argv = ['node', 'script.js', `--file=${testFilePath}`]
    const args = (await argv()) as ArgvResult
    expect(args.file).toBe(testFilePath)
  })

  it('参数名包含短横线', async () => {
    process.argv = ['node', 'script.js', '--user-name=张三']
    const args = (await argv()) as ArgvResult
    expect(args['user-name']).toBe('张三')
  })

  it('短参数带值', async () => {
    process.argv = ['node', 'script.js', '-n', 'value']
    const args = (await argv()) as ArgvResult
    expect(args.n).toBe('value')
  })

  it('组合短参数', async () => {
    process.argv = ['node', 'script.js', '-abc']
    const args = (await argv()) as ArgvResult
    expect(args.a).toBe(true)
    expect(args.b).toBe(true)
    expect(args.c).toBe(true)
  })
})
