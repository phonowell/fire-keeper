import $info from './info'
import $isExisted from './isExisted'
import $normalizePathToArray from './normalizePathToArray'
import $parseString from './parseString'
import $remove from './remove'
import $wrapList from './wrapList'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import using from 'gulp-using'

// interface

declare global {
  function using(): NodeJS.ReadWriteStream
}

// function

const main = async (
  source: string | string[],
  option: string | rename.Options,
): Promise<void> => {

  const listSource: string[] = $normalizePathToArray(source)
  const listHistory: string[][] = []

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(rename(option as rename.ParsedPath | rename.Options))
      .pipe(gulp.dest((e): string => {
        listHistory.push([...e.history])
        return e.base
      }))
      .on('end', (): void => resolve(true))
  })

  $info().pause()

  await Promise.all(listHistory.map(async item => {
    if (!await $isExisted(item[1])) return
    await $remove(item[0])
  }))

  $info().resume()

  $info('file', `renamed ${$wrapList(source)} as '${$parseString(option)}'`)
}

// export
export default main