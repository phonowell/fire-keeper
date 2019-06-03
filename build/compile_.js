(function() {
  module.exports = function($) {
    var M, _, getPlugin, gulp, gulpIf, normalizePath, using, wrapList;
    ({_} = $);
    ({getPlugin, normalizePath, wrapList} = $.fn);
    gulp = require('gulp');
    gulpIf = require('gulp-if');
    using = require('gulp-using');
    M = (function() {
      class M {
        /*
        compileCoffee_(source, target, option)
        compileCss_(source, target, option)
        compileHtml_(source, target, option)
        compileJs_(source, target, option)
        compileMd_(source, target, option)
        compilePug_(source, target, option)
        compileStyl_(source, target, option)
        compileTs_(source, target, option)
        compileYaml_(source, target, option)
        execute_(arg...)
        */
        async compileCoffee_(source, target, option) {
          await new Promise(function(resolve) {
            var base, coffee, include, sourcemaps, uglify;
            coffee = require('gulp-coffee');
            include = require('gulp-include');
            uglify = getPlugin('uglify');
            base = option.base;
            sourcemaps = option.map;
            return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(include()).pipe(coffee(option)).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileHtml_(source, target, option) {
          await new Promise(function(resolve) {
            var base, htmlmin, rename;
            htmlmin = require('gulp-htmlmin');
            rename = require('gulp-rename');
            base = option.base;
            return gulp.src(source, {base}).pipe(using()).pipe(rename({
              extname: '.html'
            })).pipe(gulpIf(option.minify, htmlmin({
              collapseWhitespace: true
            }))).pipe(gulp.dest(target)).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileCss_(source, target, option) {
          await new Promise(function(resolve) {
            var base, cleanCss, sourcemaps;
            cleanCss = require('gulp-clean-css');
            base = option.base;
            sourcemaps = option.map;
            return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(gulpIf(option.minify, cleanCss())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileJs_(source, target, option) {
          await new Promise(function(resolve) {
            var base, sourcemaps, uglify;
            uglify = getPlugin('uglify');
            base = option.base;
            sourcemaps = option.map;
            return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileMd_(source, target, option) {
          await new Promise(function(resolve) {
            var base, htmlmin, markdown, rename;
            htmlmin = require('gulp-htmlmin');
            markdown = require('gulp-markdown');
            rename = require('gulp-rename');
            if (option.sanitize == null) {
              option.sanitize = true;
            }
            base = option.base;
            return gulp.src(source, {base}).pipe(using()).pipe(markdown(option)).pipe(rename({
              extname: '.html'
            })).pipe(gulpIf(option.minify, htmlmin({
              collapseWhitespace: true
            }))).pipe(gulp.dest(target)).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compilePug_(source, target, option) {
          await new Promise(function(resolve) {
            var base, pug;
            pug = require('gulp-pug');
            if (option.pretty == null) {
              option.pretty = !option.minify;
            }
            base = option.base;
            return gulp.src(source, {base}).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target)).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileStyl_(source, target, option) {
          await new Promise(function(resolve) {
            var base, sourcemaps, stylus;
            stylus = require('gulp-stylus');
            if (option.compress == null) {
              option.compress = option.minify;
            }
            base = option.base;
            sourcemaps = option.map;
            return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(stylus(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileTs_(source, target, option) {
          await new Promise(function(resolve) {
            var base, isMinify, sourcemaps, ts, uglify;
            ts = require('gulp-typescript');
            uglify = getPlugin('uglify');
            base = option.base;
            isMinify = option.minify;
            sourcemaps = option.map;
            
            // have to delete these unknown options
            delete option.map;
            delete option.minify;
            return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(ts(option)).pipe(gulpIf(isMinify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async compileYaml_(source, target, option) {
          await new Promise(function(resolve) {
            var base, yaml;
            yaml = require('gulp-yaml');
            if (option.safe == null) {
              option.safe = true;
            }
            base = option.base;
            return gulp.src(source, {base}).pipe(using()).pipe(yaml(option)).pipe(gulp.dest(target)).on('end', function() {
              return resolve();
            });
          });
          return this;
        }

        async execute_(...arg) {
          var dirname, extname, i, len, listSource, method, msg, option, source, target, type;
          [source, target, option] = (function() {
            switch (arg.length) {
              case 1:
                return [arg[0], null, {}];
              case 2:
                return (function() {
                  var type;
                  type = $.type(arg[1]);
                  if (type === 'object') {
                    return [arg[0], null, arg[1]];
                  }
                  if (type === 'string') {
                    return [arg[0], arg[1], {}];
                  }
                  throw new Error(`invalid type '${type}'`);
                })();
              case 3:
                return arg;
              default:
                throw new Error('invalid argument length');
            }
          })();
          option = _.extend({
            map: false,
            minify: true
          }, option);
          
          // message
          msg = `compiled ${wrapList(source)}`;
          if (target) {
            msg += ` to ${wrapList(target)}`;
          }
          
          // base
          type = $.type(source);
          if (type === 'string' && ~source.search(/\/\*/)) {
            option.base || (option.base = normalizePath(source).replace(/\/\*.*/, ''));
          }
          
          // each & compile
          listSource = (await $.source_(source));
          for (i = 0, len = listSource.length; i < len; i++) {
            source = listSource[i];
            ({extname, dirname} = $.getName(source));
            method = this.mapMethod[extname];
            method || (function() {
              throw new Error(`invalid extname '${extname}'`);
            })();
            target || (target = dirname);
            target = normalizePath(target);
            await this[method](source, target, option);
          }
          $.info('compile', msg);
          return this;
        }

      };

      /*
      mapMethod
      */
      M.prototype.mapMethod = {
        '.coffee': 'compileCoffee_',
        '.css': 'compileCss_',
        '.htm': 'compileHtml_',
        '.html': 'compileHtml_',
        '.js': 'compileJs_',
        '.md': 'compileMd_',
        '.pug': 'compilePug_',
        '.styl': 'compileStyl_',
        '.ts': 'compileTs_',
        '.yaml': 'compileYaml_',
        '.yml': 'compileYaml_'
      };

      return M;

    }).call(this);
    
    // return
    return $.compile_ = async function(...arg) {
      var m;
      m = new M();
      await m.execute_(...arg);
      return $; // return
    };
  };

}).call(this);
