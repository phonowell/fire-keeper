import $info, { pause, resume, status } from './info'
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

type OptionRename = {
  dirname?: string | undefined
  basename?: string | undefined
  extname?: string | undefined
  prefix?: string | undefined
  suffix?: string | undefined
}

// function

const main = async (
  source: string | string[],
  option: string | OptionRename,
): Promise<void> => {

  const listSource: string[] = $normalizePathToArray(source)
  const listHistory: string[][] = []

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(plumber())
      .pipe(gulpIf(!status.isSilent, using()))
      .pipe(rename(option as rename.ParsedPath | OptionRename))
      .pipe(gulp.dest((e): string => {
        listHistory.push([...e.history])
        return e.base
      }))
      .on('end', (): void => resolve(true))
  })

  pause()

  await Promise.all(listHistory.map(async item => {
    if (!await $isExisted(item[1])) return
    await $remove(item[0])
  }))

  resume()

  $info('file', `renamed ${$wrapList(source)} as '${$parseString(option)}'`)
}

// export
export default main