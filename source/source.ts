import $normalizePathToArray from './normalizePathToArray'
import gulp from 'gulp'

// interface

type ListSource = string[] & { __is_listed_as_source__?: boolean }

// variable

const keyPrivate = '__is_listed_as_source__'

// function

const main = (
  source: string | string[] | ListSource,
): Promise<string[]> => {

  if (!source) return new Promise(resolve => resolve([]))
  if (source instanceof Array && source[keyPrivate]) return new Promise(resolve => resolve(source))

  const group = $normalizePathToArray(source)

  return new Promise(resolve => {
    const listSource: ListSource = []
    listSource[keyPrivate] = true

    gulp.src(group, {
      allowEmpty: true,
      read: false,
    })
      .on('data', (it: { path: string }) => listSource.push(it.path))
      .on('end', () => resolve(listSource))
  })
}

// export
export default main