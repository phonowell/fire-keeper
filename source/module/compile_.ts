import $ from '..'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import using from 'gulp-using'

// interface

declare global {
  function using(): NodeJS.ReadWriteStream
}

interface IOption {
  bare: boolean
  base: string
  minify: boolean
  sourcemaps: boolean
}

// function

class M {

  mapMethod = {
    '.coffee': 'compileCoffee_',
    '.css': 'compileCss_',
    '.html': 'compileHtml_',
    '.js': 'compileJs_',
    '.md': 'compileMd_',
    '.pug': 'compilePug_',
    '.styl': 'compileStyl_',
    '.ts': 'compileTs_',
    '.yaml': 'compileYaml_'
  } as const

  async compileCoffee_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const coffee = require('gulp-coffee')
      const uglifyEs = require('uglify-es')
      const composer = require('gulp-uglify/composer')
      const uglify = composer(uglifyEs, console)

      const { bare, base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(coffee({ bare }))
        .pipe(gulpIf(!!minify, uglify()))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve())
    })
  }

  async compileHtml_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const htmlmin = require('gulp-htmlmin')
      const rename = require('gulp-rename')

      const { base, minify } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulpIf(!!minify, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(target))
        .on('end', () => resolve())
    })
  }

  async compileCss_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const cleanCss = require('gulp-clean-css')

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(gulpIf(!!minify, cleanCss()))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve())
    })
  }

  async compileJs_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const uglifyEs = require('uglify-es')
      const composer = require('gulp-uglify/composer')
      const uglify = composer(uglifyEs, console)

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(gulpIf(!!minify, uglify()))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve())
    })
  }

  async compileMd_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const htmlmin = require('gulp-htmlmin')
      const markdown = require('gulp-markdown')
      const rename = require('gulp-rename')

      const { base, minify } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(markdown({ sanitize: true }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulpIf(!!minify, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(target))
        .on('end', () => resolve())
    })
  }

  async compilePug_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const pug = require('gulp-pug')

      const { base, minify } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(pug({ pretty: !minify }))
        .pipe(gulp.dest(target))
        .on('end', () => resolve())
    })
  }

  async compileStyl_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const stylus = require('gulp-stylus')

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(stylus({ compress: minify }))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve())
    })
  }

  async compileTs_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const ts = require('gulp-typescript')
      const tsProject = ts.createProject($.normalizePath('./tsconfig.json'))
      const uglifyEs = require('uglify-es')
      const composer = require('gulp-uglify/composer')
      const uglify = composer(uglifyEs, console)

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(tsProject())
        .pipe(gulpIf(!!minify, uglify()))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve())
    })
  }

  async compileYaml_(
    source: string,
    target: string,
    option: IOption
  ): Promise<void> {

    await new Promise(resolve => {

      const yaml = require('gulp-yaml')

      const { base } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(yaml({ safe: true }))
        .pipe(gulp.dest(target))
        .on('end', () => resolve())
    })
  }

  async execute_(
    source: string | string[],
    option?: Partial<IOption>
  ): Promise<void>
  async execute_(
    source: string | string[],
    target: string,
    option?: Partial<IOption>
  ): Promise<void>
  async execute_(...args: [string | string[], ...unknown[]]): Promise<void> {

    const { source, target, option } = await this.formatArgument_(args)

    // message
    let msg = `compiled ${$.wrapList(args[0])}`
    if (target)
      msg += ` to '${target}'`

    // each
    for (const src of source) {
      const { extname, dirname } = $.getName(src)

      const method = this.mapMethod[
        extname as keyof M['mapMethod']
      ]
      if (!method) throw new Error(`compile_/error: invalid extname '${extname}'`)

      await this[method](
        src,
        target ? $.normalizePath(target) : dirname,
        option
      )
    }

    $.info('compile', msg)
  }

  async formatArgument_(
    input: [string | string[], ...unknown[]]
  ): Promise<{
    source: string[]
    target: string
    option: IOption
  }> {

    const listSource = await $.source_(input[0])
    let target = ''
    let option: Partial<IOption> = {}

    if (input.length === 2) {
      if (typeof input[1] === 'string')
        target = input[1]
      else
        option = input[1] as Partial<IOption>
    } else if (input.length === 3) {
      target = input[1] as string
      option = input[2] as Partial<IOption>
    }

    // base
    if (!option.base)
      if (typeof input[0] === 'string') {
        if (input[0].includes('/*'))
          option.base = $.normalizePath(input[0])
            .replace(/\/\*.*/, '')
      } else
        option.base = ''

    return {
      source: listSource,
      target,
      option: Object.assign({
        bare: false,
        base: '',
        minify: true,
        sourcemaps: false
      }, option)
    }
  }

  returnSourcemaps(
    sourcemaps: boolean | undefined
  ): { sourcemaps: true } | undefined {
    return sourcemaps === true ? { sourcemaps } : undefined
  }
}

// export
const m = new M()
export default m.execute_.bind(m) as typeof m.execute_