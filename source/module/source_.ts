import $ from '..'
import gulp from 'gulp'

// interface

// eslint-disable-next-line camelcase
type ListSource = string[] & { __is_listed_as_source__?: boolean }

// variable

const keyPrivate = '__is_listed_as_source__'

// function

async function main_(
  source: string | string[] | ListSource
): Promise<string[]> {

  if (!source) return []
  if (source instanceof Array)
    if ((source as ListSource)[keyPrivate]) return source
  const group = $.normalizePathToArray(source)

  return new Promise(resolve => {
    const listSource = [] as ListSource
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
export default main_
