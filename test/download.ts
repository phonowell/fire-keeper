import { $, temp } from './index'

const a = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${temp}/download`
  await $.download(url, dir)
  if (!(await $.isExist(`${dir}/${$.getFilename(url)}`))) throw Error('0')
}
a.description = 'downloads file with default filename'

const b = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = `${temp}/download`
  const filename = 'custom.bin'
  await $.download(url, dir, filename)
  if (!(await $.isExist(`${dir}/${filename}`))) throw Error('0')
}
b.description = 'downloads file with custom filename'

const c = async (): Promise<void> => {
  const url = 'https://httpbin.org/status/404'
  const dir = `${temp}/download`
  try {
    await $.download(url, dir)
    throw Error('0')
  } catch {
    // Expected error for 404
  }
}
c.description = 'handles invalid response status'

const d = async (): Promise<void> => {
  const url = 'https://invalid.example.com'
  const dir = `${temp}/download`
  try {
    await $.download(url, dir)
    throw Error('0')
  } catch {
    // Expected error for network failure
  }
}
d.description = 'handles network errors'

const e = async (): Promise<void> => {
  const url = 'https://httpbin.org/bytes/100'
  const dir = '/invalid/directory/path'
  try {
    await $.download(url, dir)
    throw Error('0')
  } catch {
    // Expected error for file system issues
  }
}
e.description = 'handles file system errors'

export { a, b, c, d, e }
