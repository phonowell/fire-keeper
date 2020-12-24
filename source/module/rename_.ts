import $ from '..'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import using from 'gulp-using'
import rename from 'gulp-rename'

// interface

declare global {
  function using(): NodeJS.ReadWriteStream
}

// function

async function main_(
  source: string | string[],
  option: string | rename.Options
): Promise<void> {

  const listSource: string[] = $.normalizePathToArray(source)
  const listHistory: string[][] = []

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(gulpIf(!$.info().isSilent, using()))
      .pipe(rename(option as rename.ParsedPath | rename.Options))
      .pipe(gulp.dest((e): string => {
        listHistory.push([...e.history])
        return e.base
      }))
      .on('end', (): void => resolve(true))
  })

  $.info().pause()
  for (const item of listHistory) {
    if (await $.isExisted_(item[1]))
      await $.remove_(item[0])
  }
  $.info().resume()

  $.info('file', `renamed ${$.wrapList(source)} as '${$.parseString(option)}'`)
}

// export
export default main_