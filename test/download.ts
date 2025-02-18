import { Buffer } from 'buffer'

import { download, isExist, read } from '../src'

import { TEMP } from './index'

// 合并二进制内容验证和大文件测试
const binaryAndSizeTest = async (): Promise<void> => {
  // 测试大文件下载和内容验证
  const url = 'https://httpbin.org/bytes/102400'
  const dir = `${TEMP}/download-test`
  const filename = 'large.bin'
  await download(url, dir, filename)

  const file = `${dir}/${filename}`
  if (!(await isExist(file))) throw Error('download failed')

  const content = await read(file, { raw: true })
  if (!(content instanceof Buffer)) throw Error('content should be binary')
  if (content.length !== 102400) throw Error('file size mismatch')
}
binaryAndSizeTest.description = 'verifies binary content and file size'

// 合并特殊情况测试
const edgeCasesTest = async (): Promise<void> => {
  // 测试空响应
  const emptyUrl = 'https://httpbin.org/status/204'
  try {
    await download(emptyUrl, `${TEMP}/download-test`)
    throw Error('should throw on empty response')
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes('No response body')
    )
      throw Error('wrong error for empty response')
  }

  // 测试Unicode文件名
  const url = 'https://httpbin.org/bytes/100'
  const filename = '测试文件.bin'
  await download(url, `${TEMP}/download-test`, filename)
  if (!(await isExist(`${TEMP}/download-test/${filename}`)))
    throw Error('unicode filename test failed')
}
edgeCasesTest.description = 'handles edge cases (empty response and unicode)'

export { binaryAndSizeTest, edgeCasesTest }
