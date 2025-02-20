/*
download 模块测试用例说明：
1. 参数验证：
  - 空URL检测
  - 空目录检测
2. 成功场景：
  - 自动获取文件名下载
  - 自定义文件名下载
  - 自动创建目录
  - 路径规范化处理
3. 文件验证：
  - 二进制文件下载
  - 大文件下载验证
4. 错误处理：
  - 404响应处理
  - 空响应体检测
5. 特殊场景：
  - Unicode文件名支持
*/

import { Buffer } from 'buffer'

import { download, isExist, read, getFilename } from '../src'

import { TEMP } from './index'

// Test parameter validation
const testParameterValidation = async (): Promise<void> => {
  // Test missing URL
  await download('', `${TEMP}/download-test`).catch((error: unknown) => {
    if (!(error instanceof Error) || !error.message.includes('empty input')) {
      throw error
    }
  })

  // Test missing directory
  await download('https://example.com/file', '').catch((error: unknown) => {
    if (
      !(error instanceof Error) ||
      !error.message.includes('dir is required')
    ) {
      throw error
    }
  })
}
testParameterValidation.description = 'Parameter Validation'

// Test auto directory creation
const testAutoCreateDir = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/new-dir-${Date.now()}`
  const filename = 'auto-create-dir.txt'

  await download(url, dir, filename)
  if (!(await isExist(`${dir}/${filename}`))) {
    throw Error('Directory was not auto-created')
  }
}

// Test path normalization
const testPathNormalization = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/.//path/norm/../test`
  const filename = 'path-test.txt'

  await download(url, dir, filename)
  const normalizedPath = `${TEMP}/path/test/${filename}`
  if (!(await isExist(normalizedPath))) {
    throw Error('Path normalization failed')
  }
}

// Test successful download scenarios
const testSuccessfulDownload = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/download-test`

  // Test with auto filename from URL
  const expectedFilename = getFilename(url)
  await download(url, dir)
  // Verify the exact file exists
  if (!(await isExist(`${dir}/${expectedFilename}`)))
    throw Error('download with auto filename failed')

  // Test with custom filename
  const customFilename = 'custom.bin'
  await download(url, dir, customFilename)
  if (!(await isExist(`${dir}/${customFilename}`)))
    throw Error('download with custom filename failed')
}
testSuccessfulDownload.description = 'Successful Download Scenarios'

// Test file content validation
const testFileContent = async (): Promise<void> => {
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
testFileContent.description = 'File Content Validation'

// Test error response handling
const testErrorResponses = async (): Promise<void> => {
  // Test invalid URL response
  const badUrl = 'https://httpbin.org/status/404'
  try {
    await download(badUrl, `${TEMP}/download-test`)
    throw Error('should throw on bad response')
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes('not found')
    )
      throw Error('wrong error for bad response')
  }

  // Test empty response body
  const emptyUrl = 'https://httpbin.org/status/204'
  try {
    await download(emptyUrl, `${TEMP}/download-test`)
    throw Error('should throw on empty response')
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes('response has no body')
    )
      throw Error('wrong error for empty response')
  }

  // Test Unicode filename
  const url = 'https://httpbin.org/bytes/100'
  const filename = '测试文件.bin'
  await download(url, `${TEMP}/download-test`, filename)
  if (!(await isExist(`${TEMP}/download-test/${filename}`)))
    throw Error('unicode filename test failed')
}
testErrorResponses.description = 'Error Response Handling'

export {
  testParameterValidation,
  testAutoCreateDir,
  testPathNormalization,
  testSuccessfulDownload,
  testFileContent,
  testErrorResponses,
}
