import { Buffer } from 'buffer'

import { download, isExist, read, getFilename } from '../src'

import { TEMP } from './index'

// Test parameter validation
const validationTest = async (): Promise<void> => {
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
validationTest.description = 'validates required parameters'

// Test success cases with auto and custom filenames
const successTest = async (): Promise<void> => {
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
successTest.description = 'handles successful downloads'

// Test binary content and large file handling
const binaryAndSizeTest = async (): Promise<void> => {
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

// Test error cases
const errorTest = async (): Promise<void> => {
  // Test invalid URL response
  const badUrl = 'https://httpbin.org/status/404'
  try {
    await download(badUrl, `${TEMP}/download-test`)
    throw Error('should throw on bad response')
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes('unexpected response')
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
      !error.message.includes('No response body')
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
errorTest.description = 'handles error cases and special filenames'

export { validationTest, successTest, binaryAndSizeTest, errorTest }
