import gulp from 'gulp'
import gulpIf from 'gulp-if'
import info from './info'
import isExisted_ from './isExisted_'
import normalizePathToArray from './normalizePathToArray'
import parseString from './parseString'
import plumber from 'gulp-plumber'
import remove_ from './remove_'
import rename from 'gulp-rename'
import using from 'gulp-using'
import wrapList from './wrapList'

// interface

declare global {
  // eslint-disable-next-line no-shadow
  function using(): NodeJS.ReadWriteStream
}

// function

async function main_(
  source: string | string[],
  option: string | rename.Options
): Promise<void> {

  const listSource: string[] = normalizePathToArray(source)
  const listHistory: string[][] = []

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(plumber())
      .pipe(gulpIf(!info().isSilent, using()))
      .pipe(rename(option as rename.ParsedPath | rename.Options))
      .pipe(gulp.dest((e): string => {
        listHistory.push([...e.history])
        return e.base
      }))
      .on('end', (): void => resolve(true))
  })

  info().pause()

  async function sub_(
    item: string[]
  ): Promise<void> {

    if (await isExisted_(item[1]))
      await remove_(item[0])
  }
  await Promise.all(listHistory.map(sub_))

  info().resume()

  info('file', `renamed ${wrapList(source)} as '${parseString(option)}'`)
}

// export
export default main_