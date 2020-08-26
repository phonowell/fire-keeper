"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const gulp_1 = __importDefault(require("gulp"));
const gulp_if_1 = __importDefault(require("gulp-if"));
const gulp_using_1 = __importDefault(require("gulp-using"));
// function
class M {
    constructor() {
        this.mapMethod = {
            '.coffee': 'compileCoffee_',
            '.css': 'compileCss_',
            '.html': 'compileHtml_',
            '.js': 'compileJs_',
            '.md': 'compileMd_',
            '.pug': 'compilePug_',
            '.styl': 'compileStyl_',
            '.ts': 'compileTs_',
            '.yaml': 'compileYaml_'
        };
    }
    async compileCoffee_(source, target, option) {
        await new Promise(resolve => {
            const coffee = require('gulp-coffee');
            const uglifyEs = require('uglify-es');
            const composer = require('gulp-uglify/composer');
            const uglify = composer(uglifyEs, console);
            const { bare, base, minify, sourcemaps } = option;
            gulp_1.default.src(source, { base, sourcemaps })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(coffee({ bare }))
                .pipe(gulp_if_1.default(!!minify, uglify()))
                .pipe(gulp_1.default.dest(target, this.returnSourcemaps(sourcemaps)))
                .on('end', () => resolve());
        });
    }
    async compileHtml_(source, target, option) {
        await new Promise(resolve => {
            const htmlmin = require('gulp-htmlmin');
            const rename = require('gulp-rename');
            const { base, minify } = option;
            gulp_1.default.src(source, { base })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(rename({ extname: '.html' }))
                .pipe(gulp_if_1.default(!!minify, htmlmin({ collapseWhitespace: true })))
                .pipe(gulp_1.default.dest(target))
                .on('end', () => resolve());
        });
    }
    async compileCss_(source, target, option) {
        await new Promise(resolve => {
            const cleanCss = require('gulp-clean-css');
            const { base, minify, sourcemaps } = option;
            gulp_1.default.src(source, { base, sourcemaps })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(gulp_if_1.default(!!minify, cleanCss()))
                .pipe(gulp_1.default.dest(target, this.returnSourcemaps(sourcemaps)))
                .on('end', () => resolve());
        });
    }
    async compileJs_(source, target, option) {
        await new Promise(resolve => {
            const uglifyEs = require('uglify-es');
            const composer = require('gulp-uglify/composer');
            const uglify = composer(uglifyEs, console);
            const { base, minify, sourcemaps } = option;
            gulp_1.default.src(source, { base, sourcemaps })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(gulp_if_1.default(!!minify, uglify()))
                .pipe(gulp_1.default.dest(target, this.returnSourcemaps(sourcemaps)))
                .on('end', () => resolve());
        });
    }
    async compileMd_(source, target, option) {
        await new Promise(resolve => {
            const htmlmin = require('gulp-htmlmin');
            const markdown = require('gulp-markdown');
            const rename = require('gulp-rename');
            const { base, minify } = option;
            gulp_1.default.src(source, { base })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(markdown({ sanitize: true }))
                .pipe(rename({ extname: '.html' }))
                .pipe(gulp_if_1.default(!!minify, htmlmin({ collapseWhitespace: true })))
                .pipe(gulp_1.default.dest(target))
                .on('end', () => resolve());
        });
    }
    async compilePug_(source, target, option) {
        await new Promise(resolve => {
            const pug = require('gulp-pug');
            const { base, minify } = option;
            gulp_1.default.src(source, { base })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(pug({ pretty: !minify }))
                .pipe(gulp_1.default.dest(target))
                .on('end', () => resolve());
        });
    }
    async compileStyl_(source, target, option) {
        await new Promise(resolve => {
            const stylus = require('gulp-stylus');
            const { base, minify, sourcemaps } = option;
            gulp_1.default.src(source, { base, sourcemaps })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(stylus({ compress: minify }))
                .pipe(gulp_1.default.dest(target, this.returnSourcemaps(sourcemaps)))
                .on('end', () => resolve());
        });
    }
    async compileTs_(source, target, option) {
        await new Promise(resolve => {
            const ts = require('gulp-typescript');
            const tsProject = ts.createProject(__1.default.normalizePath('./tsconfig.json'));
            const uglifyEs = require('uglify-es');
            const composer = require('gulp-uglify/composer');
            const uglify = composer(uglifyEs, console);
            const { base, minify, sourcemaps } = option;
            gulp_1.default.src(source, { base, sourcemaps })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(tsProject())
                .pipe(gulp_if_1.default(!!minify, uglify()))
                .pipe(gulp_1.default.dest(target, this.returnSourcemaps(sourcemaps)))
                .on('end', () => resolve());
        });
    }
    async compileYaml_(source, target, option) {
        await new Promise(resolve => {
            const yaml = require('gulp-yaml');
            const { base } = option;
            gulp_1.default.src(source, { base })
                .pipe(gulp_if_1.default(!__1.default.info().isSilent, gulp_using_1.default()))
                .pipe(yaml({ safe: true }))
                .pipe(gulp_1.default.dest(target))
                .on('end', () => resolve());
        });
    }
    async execute_(...args) {
        const { source, target, option } = await this.formatArgument_(args);
        // message
        let msg = `compiled ${__1.default.wrapList(args[0])}`;
        if (target)
            msg += ` to '${target}'`;
        // each
        for (const src of source) {
            const { extname, dirname } = __1.default.getName(src);
            const method = this.mapMethod[extname];
            if (!method)
                throw new Error(`compile_/error: invalid extname '${extname}'`);
            await this[method](src, target ? __1.default.normalizePath(target) : dirname, option);
        }
        __1.default.info('compile', msg);
    }
    async formatArgument_(input) {
        const listSource = await __1.default.source_(input[0]);
        let target = '';
        let option = {};
        if (input.length === 2) {
            if (typeof input[1] === 'string')
                target = input[1];
            else
                option = input[1];
        }
        else if (input.length === 3) {
            target = input[1];
            option = input[2];
        }
        // base
        if (!option.base)
            if (typeof input[0] === 'string') {
                if (input[0].includes('/*'))
                    option.base = __1.default.normalizePath(input[0])
                        .replace(/\/\*.*/, '');
            }
            else
                option.base = '';
        return {
            source: listSource,
            target,
            option: Object.assign({
                bare: false,
                base: '',
                minify: true,
                sourcemaps: false
            }, option)
        };
    }
    returnSourcemaps(sourcemaps) {
        return sourcemaps === true ? { sourcemaps } : undefined;
    }
}
// export
const m = new M();
exports.default = m.execute_.bind(m);
