import { $, temp } from './index'

// function

const a = async () => {
  const listSource = [`${temp}/a.txt`, `${temp}/b.txt`, `${temp}/c.txt`]
  await Promise.all(
    listSource.map(source => $.write(source, 'a little message')),
  )
  if ((await $.glob(listSource)).length !== 3) throw new Error('0')
}
a.description = 'in project'

const b = async () => {
  const listSource = ['~/Desktop/a.txt', '~/Desktop/b.txt', '~/Desktop/c.txt']
  await Promise.all(
    listSource.map(source => $.write(source, 'a little message')),
  )
  if ((await $.glob(listSource)).length !== 3) throw new Error('0')
  await $.remove(listSource) // clean
}
b.description = 'out of project'

// export
export { a, b }
