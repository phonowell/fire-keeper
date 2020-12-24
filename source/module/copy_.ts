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
  target: string,
  option?: string | rename.Options
): Promise<void> {

  const listSource = $.normalizePathToArray(source)
  if (target) target = $.normalizePath(target)

  if (!listSource.length) return

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(gulpIf(!$.info().isSilent, using()))
      .pipe(gulpIf(!!option, rename(option as rename.ParsedPath | rename.Options)))
      .pipe(gulp.dest(e => target || e.base))
      .on('end', () => resolve(true))
  })

  let msg = `copied ${$.wrapList(source)} to 'target'`
  if (option) msg += `, as '${$.parseString(option)}'`
  $.info('file', msg)
}

// export
export default main_