import $info from './info'
import $normalizePath from './normalizePath'
import $normalizePathToArray from './normalizePathToArray'
import $parseString from './parseString'
import $wrapList from './wrapList'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import using from 'gulp-using'

// interface

declare global {
  // eslint-disable-next-line no-shadow
  function using(): NodeJS.ReadWriteStream
}

// function

const main = async (
  source: string | string[],
  target: string,
  option?: string | rename.Options,
): Promise<void> => {

  const listSource = $normalizePathToArray(source)

  const _target = target
    ? $normalizePath(target)
    : ''

  if (!listSource.length) return

  await new Promise(resolve => {
    gulp.src(listSource, { allowEmpty: true })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(gulpIf(!!option, rename(option as rename.ParsedPath | rename.Options)))
      .pipe(gulp.dest(e => _target || e.base))
      .on('end', () => resolve(true))
  })

  let msg = `copied ${$wrapList(source)} to '${_target}'`
  if (option) msg += `, as '${$parseString(option)}'`
  $info('file', msg)
}

// export
export default main