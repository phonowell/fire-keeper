import { isExist, remove, write, zip } from '../src'

import { TEMP } from '.'

const prepare = async () => {
  // Clean previous files
  await remove(`${TEMP}/*.zip`)
  await remove(`${TEMP}/*.txt`)
  await remove(`${TEMP}/sub`)

  // Create test files
  await write(`${TEMP}/a.txt`, 'content a')
  await write(`${TEMP}/b.txt`, 'content b')
  await write(`${TEMP}/sub/c.txt`, 'content c')
}

export const a = async () => {
  await prepare()

  // Test single file zip
  await zip(`${TEMP}/a.txt`, TEMP, 'single.zip')
  if (!(await isExist(`${TEMP}/single.zip`)))
    throw new Error('single file zip failed')

  // Test multiple files zip
  await zip([`${TEMP}/a.txt`, `${TEMP}/b.txt`], TEMP, 'multiple.zip')
  if (!(await isExist(`${TEMP}/multiple.zip`)))
    throw new Error('multiple files zip failed')

  // Test wildcard pattern
  await zip(`${TEMP}/*.txt`, TEMP, 'wild.zip')
  if (!(await isExist(`${TEMP}/wild.zip`)))
    throw new Error('wildcard pattern zip failed')

  // Test custom base directory
  await zip(`${TEMP}/sub/c.txt`, TEMP, {
    base: `${TEMP}/sub`,
    filename: 'base.zip',
  })
  if (!(await isExist(`${TEMP}/base.zip`)))
    throw new Error('custom base zip failed')

  // Test default target directory
  await zip(`${TEMP}/a.txt`)
  if (!(await isExist(`${TEMP}/temp.zip`)))
    throw new Error('default target zip failed')

  // Test default filename
  await remove(`${TEMP}/temp.zip`)
  await zip(`${TEMP}/a.txt`, TEMP)
  if (!(await isExist(`${TEMP}/temp.zip`)))
    throw new Error('default filename zip failed')

  // Test custom options
  await zip(`${TEMP}/a.txt`, TEMP, { filename: 'custom.zip' })
  if (!(await isExist(`${TEMP}/custom.zip`)))
    throw new Error('custom options zip failed')

  // Test error handling
  // Test error handling for empty source list
  let errorThrown = false
  try {
    await zip([], TEMP)
  } catch {
    errorThrown = true
  }
  if (!errorThrown)
    throw new Error('error handling failed - expected error was not thrown')

  // Clean up
  await remove(`${TEMP}/*.zip`)
  await remove(`${TEMP}/*.txt`)
  await remove(`${TEMP}/sub`)
}
