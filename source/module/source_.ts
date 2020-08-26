import $ from '..'
import gulp from 'gulp'

// interface

type IListSource = string[] & { __is_listed_as_source__?: boolean }

// variable

const keyPrivate = '__is_listed_as_source__'

// function

async function main_(source: string | string[] | IListSource): Promise<string[]> {

  if (!source) return []
  if (source instanceof Array)
    if ((source as IListSource)[keyPrivate]) return source
  const group = $.normalizePathToArray(source)

  return await new Promise(resolve => {
    const listSource = [] as IListSource
    listSource[keyPrivate] = true

    gulp.src(group, {
      allowEmpty: true,
      read: false
    })
      .on('data', (it: { path: string }) => listSource.push(it.path))
      .on('end', () => resolve(listSource))
  })
}

// export
export default main_