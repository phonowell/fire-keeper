import { promises as fs } from 'fs'

import { afterEach, describe, expect, it } from 'vitest'

import argv from '../src/argv.js'

type ArgvType = {
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
  $0?: string
}

const TEMP_DIR = './temp'
const TEMP_FILE = `${TEMP_DIR}/test-argv.txt`

describe('argv', () => {
  const OLD_ARGV = process.argv

  afterEach(async () => {
    process.argv = OLD_ARGV
    // 清理临时文件
    try {
      await fs.rm(TEMP_DIR, { recursive: true, force: true })
    } catch {
      // 忽略清理错误
    }
  })

  it('解析命名参数', async () => {
    process.argv = ['node', 'script.js', '--name=张三', '--age=18']
    const args = (await argv()) as ArgvType
    expect(args.name).toBe('张三')
    expect(args.age).toBe(18)
  })

  it('解析位置参数', async () => {
    process.argv = ['node', 'script.js', 'file1.txt', 'file2.txt']
    const args = (await argv()) as ArgvType
    expect(args._).toEqual(['file1.txt', 'file2.txt'])
  })

  it('解析布尔参数', async () => {
    process.argv = ['node', 'script.js', '--flag']
    const args = (await argv()) as ArgvType
    expect(args.flag).toBe(true)
  })

  it('包含 $0 字段为脚本名', async () => {
    process.argv = ['node', 'myScript.js']
    const args = (await argv()) as ArgvType
    expect(args.$0).toBe('myScript.js')
  })

  it('混合参数与位置参数', async () => {
    process.argv = [
      'node',
      'script.js',
      '--name=李四',
      'file.txt',
      '--flag',
      '--age=20',
    ]
    const args = (await argv()) as ArgvType
    expect(args.name).toBe('李四')
    expect(args.flag).toBe(true)
    expect(args.age).toBe(20)
    expect(args._).toEqual(['file.txt'])
  })

  it('重复参数为数组', async () => {
    process.argv = ['node', 'script.js', '--list=a', '--list=b']
    const args = (await argv()) as ArgvType
    expect(args.list).toEqual(['a', 'b'])
  })

  it('短参数', async () => {
    process.argv = ['node', 'script.js', '-f', 'file.txt']
    const args = (await argv()) as ArgvType
    expect(args.f).toBe('file.txt')
    expect(args._).toEqual([])
  })

  it('数字参数', async () => {
    process.argv = ['node', 'script.js', '--num=42']
    const args = (await argv()) as ArgvType
    expect(args.num).toBe(42)
  })

  it('无参数情况', async () => {
    process.argv = ['node', 'script.js']
    const args = (await argv()) as ArgvType
    expect(args._).toEqual([])
    expect(args.$0).toBe('script.js')
  })

  it('未知参数', async () => {
    process.argv = ['node', 'script.js', '--unknown']
    const args = (await argv()) as ArgvType
    expect(args.unknown).toBe(true)
  })

  it('参数为数字字符串', async () => {
    process.argv = ['node', 'script.js', '--score=3.14']
    const args = (await argv()) as ArgvType
    expect(args.score).toBe(3.14)
  })

  it('参数为布尔字符串', async () => {
    process.argv = ['node', 'script.js', '--flag=true', '--flag=false']
    const args = (await argv()) as ArgvType
    expect(args.flag).toEqual(['true', 'false'])
  })

  it('特殊字符参数', async () => {
    process.argv = ['node', 'script.js', '--path=./测试/文件.txt']
    const args = (await argv()) as ArgvType
    expect(args.path).toBe('./测试/文件.txt')
  })

  it('参数为 null/undefined/空字符串', async () => {
    process.argv = [
      'node',
      'script.js',
      '--val=null',
      '--val=undefined',
      '--val=',
    ]
    const args = (await argv()) as ArgvType
    expect(args.val).toEqual(['null', 'undefined', ''])
  })

  it('普通标志参数', async () => {
    process.argv = ['node', 'script.js', '--verbose']
    const args = (await argv()) as ArgvType
    expect(args.verbose).toBe(true)
  })

  it('参数顺序混乱', async () => {
    process.argv = ['node', 'script.js', '--a=1', 'file.txt', '--b=2', '--a=3']
    const args = (await argv()) as ArgvType
    expect(args.a).toEqual([1, 3])
    expect(args.b).toBe(2)
    expect(args._).toEqual(['file.txt'])
  })

  it('参数为临时文件路径', async () => {
    await fs.mkdir(TEMP_DIR, { recursive: true })
    await fs.writeFile(TEMP_FILE, 'test')
    process.argv = ['node', 'script.js', `--file=${TEMP_FILE}`]
    const args = (await argv()) as ArgvType
    expect(args.file).toBe(TEMP_FILE)
  })

  it('同名参数形成数组', async () => {
    process.argv = ['node', 'script.js', '--key=1', '--key=2']
    const args = (await argv()) as ArgvType
    expect(args.key).toEqual([1, 2])
  })

  it('数字字符串与纯字符串混合参数', async () => {
    process.argv = ['node', 'script.js', '--mix=1', '--mix=abc']
    const args = (await argv()) as ArgvType
    expect(args.mix).toEqual([1, 'abc'])
  })

  it('负数参数处理', async () => {
    process.argv = ['node', 'script.js', '--count=-5']
    const args = (await argv()) as ArgvType
    expect(args.count).toBe(-5)
  })

  it('参数值包含等号', async () => {
    process.argv = ['node', 'script.js', '--equation=x=y+1']
    const args = (await argv()) as ArgvType
    expect(args.equation).toBe('x=y+1')
  })

  it('位置参数包含数字', async () => {
    process.argv = ['node', 'script.js', '123', 'abc']
    const args = (await argv()) as ArgvType
    expect(args._).toEqual([123, 'abc'])
  })

  it('参数名包含短横线', async () => {
    process.argv = ['node', 'script.js', '--user-name=张三']
    const args = (await argv()) as ArgvType
    expect(args['user-name']).toBe('张三')
  })

  it('短参数带值', async () => {
    process.argv = ['node', 'script.js', '-n', 'value']
    const args = (await argv()) as ArgvType
    expect(args.n).toBe('value')
  })

  it('组合短参数', async () => {
    process.argv = ['node', 'script.js', '-abc']
    const args = (await argv()) as ArgvType
    expect(args.a).toBe(true)
    expect(args.b).toBe(true)
    expect(args.c).toBe(true)
  })
})
