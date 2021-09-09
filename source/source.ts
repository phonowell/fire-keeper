import gulp from 'gulp'
import $normalizePathToArray from './normalizePathToArray'

// interface

type ListSource = string[] & { __is_listed_as_source__?: boolean }

// variable

const keyPrivate = '__is_listed_as_source__'

// function

const main = async (
  source: string | string[] | ListSource,
): Promise<string[]> => {

  if (!source) return []
  if (source instanceof Array && source[keyPrivate]) return source

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