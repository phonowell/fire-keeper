import $info from './info'
import $normalizePath from './normalizePath'
import $source from './source_'
import $wrapList from './wrapList'
import getName from './getName'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import using from 'gulp-using'

// interface

declare global {
  // eslint-disable-next-line no-shadow
  function using(): NodeJS.ReadWriteStream
}

type Main = {
  (source: Source, Option?: OptionPartial): Promise<void>
  (source: Source, target: string, option?: OptionPartial): Promise<void>
}

type Option = {
  bare: boolean
  base: string
  minify: boolean
  sourcemaps: boolean
}

type OptionPartial = Partial<Option>

type Source = string | string[]

// variable

// function

const compileCoffee = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const coffee = (await import('gulp-coffee')).default
  const terser = (await import('gulp-terser')).default

  const { bare, base, minify, sourcemaps } = option

  await new Promise(resolve => {

    gulp.src(source, { base, sourcemaps })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(coffee({ bare }))
      .pipe(gulpIf(!!minify, terser({ safari10: true })))
      .pipe(gulp.dest(target, returnSourcemaps(sourcemaps)))
      .on('end', () => resolve(true))
  })
}

const compileHtml = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const htmlmin = (await import('gulp-htmlmin')).default
  const rename = (await import('gulp-rename')).default

  const { base, minify } = option

  await new Promise(resolve => {

    gulp.src(source, { base })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(rename({ extname: '.html' }))
      .pipe(gulpIf(!!minify, htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest(target))
      .on('end', () => resolve(true))
  })
}

const compileCss = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const cleanCss = (await import('gulp-clean-css')).default

  const { base, minify, sourcemaps } = option

  await new Promise(resolve => {

    gulp.src(source, { base, sourcemaps })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(gulpIf(!!minify, cleanCss()))
      .pipe(gulp.dest(target, returnSourcemaps(sourcemaps)))
      .on('end', () => resolve(true))
  })
}

const compileJs = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const terser = (await import('gulp-terser')).default

  const { base, minify, sourcemaps } = option

  await new Promise(resolve => {

    gulp.src(source, { base, sourcemaps })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(gulpIf(!!minify, terser({ safari10: true })))
      .pipe(gulp.dest(target, returnSourcemaps(sourcemaps)))
      .on('end', () => resolve(true))
  })
}

const compileMd = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const htmlmin = (await import('gulp-htmlmin')).default
  const markdown = (await import('gulp-markdown')).default
  const rename = (await import('gulp-rename')).default

  const { base, minify } = option

  await new Promise(resolve => {

    gulp.src(source, { base })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(markdown({ sanitize: true }))
      .pipe(rename({ extname: '.html' }))
      .pipe(gulpIf(!!minify, htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest(target))
      .on('end', () => resolve(true))
  })
}

const compilePug = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const pug = (await import('gulp-pug')).default

  const { base, minify } = option

  await new Promise(resolve => {

    gulp.src(source, { base })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(pug({ pretty: !minify }))
      .pipe(gulp.dest(target))
      .on('end', () => resolve(true))
  })
}

const compileStyl = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const stylus = (await import('gulp-stylus')).default

  const { base, minify, sourcemaps } = option

  await new Promise(resolve => {

    gulp.src(source, { base, sourcemaps })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(stylus({ compress: minify }))
      .pipe(gulp.dest(target, returnSourcemaps(sourcemaps)))
      .on('end', () => resolve(true))
  })
}

const compileTs = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const ts = (await import('gulp-typescript')).default
  const tsProject = ts.createProject($normalizePath('./tsconfig.json'))

  const { base, sourcemaps } = option

  await new Promise(resolve => {

    gulp.src(source, { base, sourcemaps })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(tsProject())
      .pipe(gulp.dest(target, returnSourcemaps(sourcemaps)))
      .on('end', () => resolve(true))
  })
}

const compileYaml = async (
  source: string,
  target: string,
  option: Option,
): Promise<void> => {

  const yaml = (await import('gulp-yaml')).default

  const { base } = option

  await new Promise(resolve => {

    gulp.src(source, { base })
      .pipe(plumber())
      .pipe(gulpIf(!$info().isSilent, using()))
      .pipe(yaml({ safe: true }))
      .pipe(gulp.dest(target))
      .on('end', () => resolve(true))
  })
}

const mapFn = {
  '.coffee': compileCoffee,
  '.css': compileCss,
  '.html': compileHtml,
  '.js': compileJs,
  '.md': compileMd,
  '.pug': compilePug,
  '.styl': compileStyl,
  '.ts': compileTs,
  '.yaml': compileYaml,
} as const

const main: Main = async (
  ...args: [string | string[], ...unknown[]]
) => {

  const { source, target, option } = await formatArgument(args)

  // message
  let msg = `compiled ${$wrapList(args[0])}`
  if (target) msg += ` to '${target}'`

  // each
  for (const src of source) {

    const { extname, dirname } = getName(src)

    const fn = mapFn[
      extname as keyof typeof mapFn
    ]
    if (!fn) throw new Error(`compile_/error: invalid extname '${extname}'`)

    // eslint-disable-next-line no-await-in-loop
    await fn(
      src,
      target ? $normalizePath(target) : dirname,
      option
    )
  }

  $info('compile', msg)
}

const formatArgument = async (
  input: [string | string[], ...unknown[]],
): Promise<{
  source: string[]
  target: string
  option: Option
}> => {

  const listSource = await $source(input[0])
  let target = ''
  let option: Partial<Option> = {}

  if (input.length === 2) {
    if (typeof input[1] === 'string')
      target = input[1]
    else
      option = input[1] as Partial<Option>
  } else if (input.length === 3) {
    target = input[1] as string
    option = input[2] as Partial<Option>
  }

  // base
  if (!option.base)
    if (typeof input[0] === 'string') {
      if (input[0].includes('/*'))
        option.base = $normalizePath(input[0])
          .replace(/\/\*.*/u, '')
    } else
      option.base = ''

  return {
    option: {
      bare: false,
      base: '',
      minify: true,
      sourcemaps: false,
      ...option,
    },
    source: listSource,
    target,
  }
}

const returnSourcemaps = (
  sourcemaps: boolean | undefined,
): { sourcemaps: true } | undefined => sourcemaps === true ? { sourcemaps } : undefined

// export
export default main