import { $, temp } from '.'

const prepare = async () => {
  // Clean previous files
  await $.remove(`${temp}/*.zip`)
  await $.remove(`${temp}/*.txt`)
  await $.remove(`${temp}/sub`)

  // Create test files
  await $.write(`${temp}/a.txt`, 'content a')
  await $.write(`${temp}/b.txt`, 'content b')
  await $.write(`${temp}/sub/c.txt`, 'content c')
}

export const a = async () => {
  await prepare()

  // Test single file zip
  await $.zip(`${temp}/a.txt`, temp, 'single.zip')
  if (!(await $.isExist(`${temp}/single.zip`)))
    throw new Error('single file zip failed')

  // Test multiple files zip
  await $.zip([`${temp}/a.txt`, `${temp}/b.txt`], temp, 'multiple.zip')
  if (!(await $.isExist(`${temp}/multiple.zip`)))
    throw new Error('multiple files zip failed')

  // Test wildcard pattern
  await $.zip(`${temp}/*.txt`, temp, 'wild.zip')
  if (!(await $.isExist(`${temp}/wild.zip`)))
    throw new Error('wildcard pattern zip failed')

  // Test custom base directory
  await $.zip(`${temp}/sub/c.txt`, temp, {
    base: `${temp}/sub`,
    filename: 'base.zip',
  })
  if (!(await $.isExist(`${temp}/base.zip`)))
    throw new Error('custom base zip failed')

  // Test default target directory
  await $.zip(`${temp}/a.txt`)
  if (!(await $.isExist(`${temp}/temp.zip`)))
    throw new Error('default target zip failed')

  // Test default filename
  await $.remove(`${temp}/temp.zip`)
  await $.zip(`${temp}/a.txt`, temp)
  if (!(await $.isExist(`${temp}/temp.zip`)))
    throw new Error('default filename zip failed')

  // Test custom options
  await $.zip(`${temp}/a.txt`, temp, { filename: 'custom.zip' })
  if (!(await $.isExist(`${temp}/custom.zip`)))
    throw new Error('custom options zip failed')

  // Test error handling
  // Test error handling for empty source list
  let errorThrown = false
  try {
    await $.zip([], temp)
  } catch {
    errorThrown = true
  }
  if (!errorThrown)
    throw new Error('error handling failed - expected error was not thrown')

  // Clean up
  await $.remove(`${temp}/*.zip`)
  await $.remove(`${temp}/*.txt`)
  await $.remove(`${temp}/sub`)
}
