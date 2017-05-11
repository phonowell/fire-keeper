(function() {
  var $, $$, $p, Promise, _, _error, _normalizePath, changed, cleanCss, co, coffee, coffeelint, del, fs, gulp, gulpif, htmlmin, ignore, include, jade, livereload, markdown, path, plumber, pug, regenerator, rename, replace, sourcemaps, string, stylus, uglify, uglifyMinifier, uglifyjs, using, yaml, zip,
    slice = [].slice;

  path = require('path');

  fs = require('fs');

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  gulp = require('gulp');

  module.exports = $$ = {};

  _error = function(msg) {
    return new Error((function() {
      switch (msg) {
        case 'length':
          return 'invalid arguments length';
        case 'type':
          return 'invalid arguments type';
        default:
          return msg;
      }
    })());
  };

  $$.library = {
    $: $,
    _: _,
    Promise: Promise,
    gulp: gulp
  };

  $p = $$.plugin = require('gulp-load-plugins')();

  del = $p.del = require('del');

  $p.yargs = require('yargs');

  using = $p.using, plumber = $p.plumber, ignore = $p.ignore, changed = $p.changed, include = $p.include, replace = $p.replace, rename = $p.rename, yaml = $p.yaml, pug = $p.pug, jade = $p.jade, markdown = $p.markdown, coffee = $p.coffee, stylus = $p.stylus, sourcemaps = $p.sourcemaps, regenerator = $p.regenerator, htmlmin = $p.htmlmin, cleanCss = $p.cleanCss, zip = $p.zip, coffeelint = $p.coffeelint, livereload = $p.livereload;

  gulpif = $p["if"];

  uglifyjs = require('uglify-js-harmony');

  uglifyMinifier = require('gulp-uglify/minifier');

  uglify = $p.uglify = function() {
    return uglifyMinifier({}, uglifyjs);
  };

  $$.argv = $p.yargs.argv;

  $$.os = (function() {
    switch (false) {
      case !~(string = process.platform).search('darwin'):
        return 'macos';
      case !~string.search('win'):
        return 'windows';
      default:
        return 'linux';
    }
  })();

  $$.base = process.cwd();

  $$.path = {
    gulp: './gulpfile.js',
    source: './source',
    build: './build',
    secret: './secret'
  };

  $$.path.jade = $$.path.source + "/**/*.jade";

  $$.path.stylus = $$.path.source + "/**/*.styl";

  $$.path.coffee = $$.path.source + "/**/*.coffee";

  $$.path.yaml = $$.path.secret + "/**/*.yml";

  _normalizePath = function(src) {
    var _src, i, len, results;
    src = (function() {
      switch ($.type(src)) {
        case 'string':
          return [src];
        case 'array':
          return src;
        default:
          throw _error('type');
      }
    })();
    results = [];
    for (i = 0, len = src.length; i < len; i++) {
      _src = src[i];
      results.push(path.normalize(_src));
    }
    return results;
  };

  $$.task = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    switch (args.length) {
      case 1:
        return gulp.tasks[args[0]].fn;
      case 2:
        return gulp.task.apply(gulp, args);
      default:
        throw _error('length');
    }
  };

  $$.task('default', function() {
    var a, key, list;
    list = [];
    for (key in gulp.tasks) {
      list.push(key);
    }
    list.sort();
    return $.info('task', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = list.length; i < len; i++) {
        a = list[i];
        results.push("'" + a + "'");
      }
      return results;
    })()).join(', '));
  });

  $$.task('noop', function() {
    return null;
  });

  $$.copy = co(function*(source, target, name) {
    var msg;
    if (target == null) {
      target = './';
    }
    source = _normalizePath(source);
    target = path.normalize(target);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(name, rename(name))).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    msg = "copied '" + source + "' to '" + target + "'";
    if (name) {
      msg += ", as '" + ($.parseString(name)) + "'";
    }
    return $.info('copy', msg);
  });

  $$.cp = $$.copy;

  $$.link = co(function*(origin, target) {
    var isDir, ref, type;
    if (!(origin && target)) {
      throw _error('length');
    }
    origin = path.normalize(origin);
    target = path.normalize(target);
    if (!fs.existsSync(origin)) {
      throw _error("'" + origin + "' was invalid");
    }
    isDir = fs.statSync(origin).isDirectory();
    type = isDir ? 'dir' : 'file';
    if ((ref = $$.os) === 'windows' || ref === 'linux') {
      origin = path.normalize("" + $$.base + path.sep + origin);
    }
    yield new Promise(function(resolve) {
      return fs.symlink(origin, target, type, function(err) {
        if (err) {
          throw err;
        }
        if (type === 'dir') {
          type = 'directory';
        }
        return resolve();
      });
    });
    return $.info('link', "linked '" + type + "' '" + origin + "' to '" + target + "'");
  });

  $$.ln = $$.link;

  $$.makeDirectory = co(function*(src) {
    var mkdirp;
    if (!src) {
      throw _error('length');
    }
    mkdirp = require('mkdirp');
    src = path.normalize(src);
    yield new Promise(function(resolve) {
      return mkdirp(src, function(err) {
        if (err) {
          throw err;
        }
        return resolve();
      });
    });
    return $.info('create', "created '" + src + "'");
  });

  $$.mkdir = $$.makeDirectory;

  $$["delete"] = co(function*(source) {
    var a;
    source = _normalizePath(source);
    yield del(source, {
      force: true
    });
    return $.info('delete', "deleted " + (((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = source.length; i < len; i++) {
        a = source[i];
        results.push("'" + a + "'");
      }
      return results;
    })()).join(', ')));
  });

  $$.remove = $$["delete"];

  $$.rm = $$["delete"];

  $$.replace = co(function*() {
    var args, pathSource, pathTarget, ref, replacement, target;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (args.length) {
        case 3:
          return [args[0], null, args[1], args[2]];
        case 4:
          return args;
        default:
          throw _error('length');
      }
    })(), pathSource = ref[0], pathTarget = ref[1], target = ref[2], replacement = ref[3];
    pathSource = path.normalize(pathSource);
    pathTarget || (pathTarget = path.dirname(pathSource).replace(/\*/g, ''));
    pathTarget = path.normalize(pathTarget);
    yield new Promise(function(resolve) {
      return gulp.src(pathSource).pipe(plumber()).pipe(using()).pipe(replace(target, replacement)).pipe(gulp.dest(pathTarget)).on('end', function() {
        return resolve();
      });
    });
    return $.info('replace', "replaced '" + target + "' to '" + replacement + "', from '" + pathSource + "' to '" + pathTarget + "'");
  });

  (function() {
    var fn;
    fn = $$.compile = co(function*() {
      var a, args, compiler, extname, method, option, ref, source, target;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = (function() {
        switch (args.length) {
          case 1:
            return [args[0], null, {}];
          case 2:
            switch ($.type(args[1])) {
              case 'string':
                return [args[0], args[1], {}];
              case 'object':
                return [args[0], null, args[1]];
              default:
                throw _error('type');
            }
            break;
          case 3:
            return args;
          default:
            throw _error('length');
        }
      })(), source = ref[0], target = ref[1], option = ref[2];
      source = _normalizePath(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw _error('extname was null');
      }
      method = (function() {
        switch (extname) {
          case 'yml':
            return 'yaml';
          case 'md':
            return 'markdown';
          case 'styl':
            return 'stylus';
          default:
            return extname;
        }
      })();
      target || (target = path.dirname(source[0]).replace(/\*/g, ''));
      target = path.normalize(target);
      option = _.extend({
        map: false,
        minify: true
      }, option);
      compiler = fn[method];
      if (!compiler) {
        throw _error("invalid extname: '." + extname + "'");
      }
      yield compiler(source, target, option);
      return $.info('compile', "compiled " + (((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          a = source[i];
          results.push("'" + a + "'");
        }
        return results;
      })()).join(', ')) + " to '" + target + "'");
    });
    fn.yaml = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.safe == null) {
          option.safe = true;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(yaml(option)).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.stylus = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.compress == null) {
          option.compress = option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(stylus(option)).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.css = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.css')).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(gulpif(option.minify, cleanCss())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.coffee = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.regenerator == null) {
          option.regenerator = false;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(include()).pipe(coffee(option)).pipe(gulpif(option.regenerator, regenerator())).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.js = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.regenerator == null) {
          option.regenerator = false;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.js')).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(gulpif(option.regenerator, regenerator())).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.pug = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.pretty == null) {
          option.pretty = !option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.jade = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.pretty == null) {
          option.pretty = !option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(jade(option)).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    return fn.markdown = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.sanitize == null) {
          option.sanitize = true;
        }
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(markdown(option)).pipe(gulpif(option.minify, htmlmin({
          collapseWhitespace: true
        }))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
  })();

  (function() {
    var fn;
    fn = $$.lint = function(key) {
      return fn[key]();
    };
    return fn.coffee = function() {
      return new Promise(function(resolve) {
        return gulp.src($$.path.coffee).pipe(plumber()).pipe(using()).pipe(coffeelint()).pipe(coffeelint.reporter()).on('end', function() {
          return resolve();
        });
      });
    };
  })();

  $$.zip = co(function*(origin, target) {
    var dirname, filename;
    if (target == null) {
      target = './zip.zip';
    }
    origin = _normalizePath(origin);
    target = path.normalize(target);
    dirname = path.dirname(target);
    filename = path.basename(target);
    yield new Promise(function(resolve) {
      return gulp.src(origin).pipe(plumber()).pipe(using()).pipe(zip(filename)).pipe(gulp.dest(dirname)).on('end', function() {
        return resolve();
      });
    });
    return $.info('zip', "zipped '" + origin + "' to '" + target + "'");
  });

  $$.divide = function() {
    return $.log($$.divide['__string__']);
  };

  $$.divide['__string__'] = _.trim(_.repeat('- ', 16));

  $$.delay = co(function*(time) {
    yield new Promise(function(resolve) {
      return $.next(time, function() {
        return resolve();
      });
    });
    return $.info('delay', "delayed '" + time + " ms'");
  });

  $$.watch = $p.watch;

  $$.reload = function(source) {
    source = _normalizePath(source);
    livereload.listen();
    return $$.watch(source).pipe(livereload());
  };

  $$.shell = function(cmd) {
    return new Promise(function(resolve) {
      return $.shell(cmd, function() {
        return resolve();
      });
    });
  };

}).call(this);
