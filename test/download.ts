type MockFetchOptions = {
  status?: number
  statusText?: string
  body?: string | Buffer | object | ArrayBuffer | unknown
  arrayBuffer?: ArrayBuffer
  throwError?: boolean | Error
}

type MockFetchResponse = {
  status: number
  statusText: string
  body: string | Buffer | object | ArrayBuffer | unknown
  arrayBuffer: () => Promise<ArrayBuffer>
  text: () => Promise<string>
  json: () => Promise<unknown>
}

export const mockFetch = (
  options: MockFetchOptions = {},
): Promise<MockFetchResponse> =>
  new Promise<MockFetchResponse>((resolve, reject) => {
    if (options.throwError) {
      const err =
        typeof options.throwError === 'object'
          ? options.throwError
          : new Error('Mock fetch error')
      reject(err)
      return
    }
    const status = options.status ?? 200
    const statusText = options.statusText ?? 'OK'
    const body: string | Buffer | object | ArrayBuffer | unknown =
      options.body ?? ''
    const arrBuf: ArrayBuffer =
      options.arrayBuffer ??
      (new TextEncoder().encode(String(body)).buffer as ArrayBuffer)

    resolve({
      status,
      statusText,
      body,
      arrayBuffer: () => Promise.resolve(arrBuf),
      text: () =>
        Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
      json: () => {
        try {
          return Promise.resolve(
            typeof body === 'string' ? JSON.parse(body) : body,
          )
        } catch {
          return Promise.resolve(body)
        }
      },
    })
  })

import { Buffer } from 'buffer'

import { download, getFilename, isExist, read } from '../src/index.js'

import { TEMP } from './index.js'

const fetchWrapper = (input: RequestInfo | URL): Promise<Response> => {
  const url: string =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : (input as Request).url

  let opts: MockFetchOptions = {}
  if (url.includes('/status/404')) {
    opts = {
      status: 404,
      statusText: 'Not Found',
      body: '',
      throwError: new Error('Not Found'),
    }
  } else if (url.includes('/status/204')) {
    opts = {
      status: 204,
      statusText: 'No Content',
      body: '',
      throwError: new Error('Response has no body'),
    }
  } else if (url.includes('/bytes/102400'))
    opts = { body: Buffer.alloc(102400) }
  else if (url.includes('/bytes/100')) opts = { body: Buffer.alloc(100) }

  return mockFetch(opts).then(
    (mockRes: MockFetchResponse) => {
      const responseInit: ResponseInit = {
        status: mockRes.status,
        statusText: mockRes.statusText,
      }
      let body: BodyInit
      if (mockRes.body instanceof Buffer || mockRes.body instanceof ArrayBuffer)
        body = mockRes.body
      else if (typeof mockRes.body === 'string') body = mockRes.body
      else body = JSON.stringify(mockRes.body)

      return new Response(body, responseInit)
    },
    (err: unknown) => Promise.reject(err),
  )
}

globalThis.fetch = fetchWrapper

const testParameterValidation: () => Promise<void> = async () => {
  await download('', `${TEMP}/download-test`).catch((error: unknown) => {
    if (!(error instanceof Error) || !error.message.includes('empty input'))
      throw error
  })

  await download('https://example.com/file', '').catch((error: unknown) => {
    if (!(error instanceof Error) || !error.message.includes('dir is required'))
      throw error
  })
}
Object.assign(testParameterValidation, { description: 'Parameter Validation' })

const testAutoCreateDir: () => Promise<void> = async () => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/new-dir-${Date.now()}`
  const filename = 'auto-create-dir.txt'

  await download(url, dir, filename)
  if (!(await isExist(`${dir}/${filename}`)))
    throw Error('Directory was not auto-created')
}

const testPathNormalization: () => Promise<void> = async () => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/.//path/norm/../test`
  const filename = 'path-test.txt'

  await download(url, dir, filename)
  const normalizedPath = `${TEMP}/path/test/${filename}`
  if (!(await isExist(normalizedPath))) throw Error('Path normalization failed')
}

const testSuccessfulDownload: () => Promise<void> = async () => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${TEMP}/download-test`

  const expectedFilename = getFilename(url)
  await download(url, dir)
  if (!(await isExist(`${dir}/${expectedFilename}`)))
    throw Error('download with auto filename failed')

  const customFilename = 'custom.bin'
  await download(url, dir, customFilename)
  if (!(await isExist(`${dir}/${customFilename}`)))
    throw Error('download with custom filename failed')
}
Object.assign(testSuccessfulDownload, {
  description: 'Successful Download Scenarios',
})

const testFileContent: () => Promise<void> = async () => {
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
Object.assign(testFileContent, { description: 'File Content Validation' })

const testErrorResponses: () => Promise<void> = async () => {
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

  const url = 'https://httpbin.org/bytes/100'
  const filename = '测试文件.bin'
  await download(url, `${TEMP}/download-test`, filename)
  if (!(await isExist(`${TEMP}/download-test/${filename}`)))
    throw Error('unicode filename test failed')
}
Object.assign(testErrorResponses, { description: 'Error Response Handling' })

const testFetchThrows: () => Promise<void> = async () => {
  const url = 'https://example.com/throw'
  globalThis.fetch = () => mockFetch({ throwError: true }) as Promise<Response>
  try {
    await download(url, `${TEMP}/download-test`)
    throw Error('should throw on fetch error')
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes('mock fetch error')
    )
      throw Error('wrong error for fetch throws')
  }
  globalThis.fetch = fetchWrapper
}
Object.assign(testFetchThrows, { description: 'Fetch Throws Exception' })

export {
  testParameterValidation,
  testAutoCreateDir,
  testPathNormalization,
  testSuccessfulDownload,
  testFileContent,
  testErrorResponses,
  testFetchThrows,
}
