import { $, temp } from './index'

const a = async () => {
  // Test single string input
  const singleFile = `${temp}/single.txt`
  await $.write(singleFile, 'single file content')
  const singleResult = await $.glob(singleFile)
  if (singleResult.length !== 1) throw new Error('single file test failed')

  // Test array input
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  await Promise.all(
    listSource.map(source => $.write(source, 'a little message')),
  )
  const arrayResult = await $.glob(listSource)
  if (arrayResult.length !== 3) throw new Error('array input test failed')

  // Test ListSource input (should return same object)
  const secondPass = await $.glob(arrayResult)
  if (secondPass !== arrayResult) throw new Error('ListSource test failed')

  // Test with options
  const optionsResult = await $.glob(listSource, { dot: true, onlyFiles: true })
  if (optionsResult.length !== 3) throw new Error('options test failed')
}
a.description = 'in project'

const b = async () => {
  const listSource = ['~/Desktop/a.txt', '~/Desktop/b.txt', '~/Desktop/c.txt']
  await Promise.all(
    listSource.map(source => $.write(source, 'a little message')),
  )
  if ((await $.glob(listSource)).length !== 3)
    throw new Error('out of project test failed')
  await $.remove(listSource) // clean
}
b.description = 'out of project'

export { a, b }
