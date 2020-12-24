import $ from '..'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import using from 'gulp-using'

// interface

declare global {
  function using(): NodeJS.ReadWriteStream
}

type Option = {
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
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const coffee = require('gulp-coffee')
      const terser = require('gulp-terser')

      const { bare, base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(coffee({ bare }))
        .pipe(gulpIf(!!minify, terser({ safari10: true })))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve(true))
    })
  }

  async compileHtml_(
    source: string,
    target: string,
    option: Option
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
        .on('end', () => resolve(true))
    })
  }

  async compileCss_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const cleanCss = require('gulp-clean-css')

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(gulpIf(!!minify, cleanCss()))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve(true))
    })
  }

  async compileJs_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const terser = require('gulp-terser')

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(gulpIf(!!minify, terser({ safari10: true })))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve(true))
    })
  }

  async compileMd_(
    source: string,
    target: string,
    option: Option
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
        .on('end', () => resolve(true))
    })
  }

  async compilePug_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const pug = require('gulp-pug')

      const { base, minify } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(pug({ pretty: !minify }))
        .pipe(gulp.dest(target))
        .on('end', () => resolve(true))
    })
  }

  async compileStyl_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const stylus = require('gulp-stylus')

      const { base, minify, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(stylus({ compress: minify }))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve(true))
    })
  }

  async compileTs_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const ts = require('gulp-typescript')
      const tsProject = ts.createProject($.normalizePath('./tsconfig.json'))
      // const terser = require('gulp-terser')

      const { base, sourcemaps } = option

      gulp.src(source, { base, sourcemaps })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(tsProject())
        // .pipe(gulpIf(!!minify, terser({ safari10: true })))
        .pipe(gulp.dest(target, this.returnSourcemaps(sourcemaps)))
        .on('end', () => resolve(true))
    })
  }

  async compileYaml_(
    source: string,
    target: string,
    option: Option
  ): Promise<void> {

    await new Promise(resolve => {

      const yaml = require('gulp-yaml')

      const { base } = option

      gulp.src(source, { base })
        .pipe(gulpIf(!$.info().isSilent, using()))
        .pipe(yaml({ safe: true }))
        .pipe(gulp.dest(target))
        .on('end', () => resolve(true))
    })
  }

  async execute_(
    source: string | string[],
    option?: Partial<Option>
  ): Promise<void>
  async execute_(
    source: string | string[],
    target: string,
    option?: Partial<Option>
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
    option: Option
  }> {

    const listSource = await $.source_(input[0])
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