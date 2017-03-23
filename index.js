(function() {
  var $, $$, $p, ERROR, Promise, _, _coffee, _normalizePath, _yaml, changed, cleanCss, co, coffee, coffeelint, colors, del, fs, gulp, gulpif, ignore, include, jade, livereload, path, plumber, regenerator, replace, stylus, uglify, using, yaml, zip,
    slice = [].slice;

  path = require('path');

  fs = require('fs');

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  gulp = require('gulp');

  colors = require('colors/safe');

  module.exports = $$ = {};

  ERROR = {
    length: 'invalid arguments length',
    type: 'invalid arguments type'
  };

  $$.library = {
    $: $,
    _: _,
    Promise: Promise,
    gulp: gulp,
    colors: colors
  };

  $p = $$.plugin = require('gulp-load-plugins')();

  del = $p.del = require('del');

  $p.yargs = require('yargs');

  using = $p.using, plumber = $p.plumber, ignore = $p.ignore, changed = $p.changed, include = $p.include, replace = $p.replace, jade = $p.jade, stylus = $p.stylus, regenerator = $p.regenerator, cleanCss = $p.cleanCss, uglify = $p.uglify, zip = $p.zip, coffeelint = $p.coffeelint, livereload = $p.livereload;

  gulpif = $p["if"];

  _coffee = $p.coffee;

  _yaml = $p.yaml;

  coffee = function() {
    return _coffee({
      map: false
    });
  };

  yaml = function() {
    return _yaml({
      safe: true
    });
  };

  $$.argv = $p.yargs.argv;

  $$.os = (function() {
    var string;
    string = process.platform;
    if (~string.search('darwin')) {
      return 'macos';
    } else if (~string.search('win')) {
      return 'windows';
    } else {
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
          throw new Error(ERROR.type);
      }
    })();
    results = [];
    for (i = 0, len = src.length; i < len; i++) {
      _src = src[i];
      results.push(path.normalize(_src));
    }
    return results;
  };

  $.info = function() {
    var a, args, arr, cache, date, html, method, msg, ref, short, type;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (args.length) {
        case 1:
          return ['log', 'default', args[0]];
        case 2:
          return ['log', args[0], args[1]];
        default:
          return args;
      }
    })(), method = ref[0], type = ref[1], msg = ref[2];
    cache = $.info['__cache__'];
    short = _.floor(_.now(), -3);
    if (cache[0] !== short) {
      cache[0] = short;
      date = new Date();
      cache[1] = ((function() {
        var i, len, ref1, results;
        ref1 = [date.getHours(), date.getMinutes(), date.getSeconds()];
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          a = ref1[i];
          results.push(_.padStart(a, 2, 0));
        }
        return results;
      })()).join(':');
    }
    arr = ["[" + cache[1] + "]"];
    if (type !== 'default') {
      arr.push("<" + (type.toUpperCase()) + ">");
    }
    arr.push(msg);
    html = arr.join(' ');
    html = html.replace(/\[.*?]/g, function(text) {
      var cont;
      cont = text.replace(/\[|]/g, '');
      return "[" + (colors.gray(cont)) + "]";
    }).replace(/<.*?>/g, function(text) {
      var cont;
      cont = text.replace(/<|>/g, '');
      return "" + (colors.gray('<')) + (colors.cyan(cont)) + (colors.gray('>'));
    }).replace(/'.*?'/g, function(text) {
      var cont;
      cont = text.replace(/'/g, '');
      return colors.magenta(cont);
    });
    console[method](html);
    return msg;
  };

  $.info['__cache__'] = [];

  $$.task = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    switch (args.length) {
      case 1:
        return gulp.tasks[args[0]].fn;
      case 2:
        return gulp.task.apply(gulp, args);
      default:
        throw new Error(ERROR.length);
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

  $$.copy = co(function*(source, target) {
    if (target == null) {
      target = './';
    }
    source = _normalizePath(source);
    target = path.normalize(target);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    return $.info('copy', "copied '" + source + "' to '" + target + "'");
  });

  $$.cp = $$.copy;

  $$.link = co(function*(origin, target) {
    var isDir, ref, type;
    if (!(origin && target)) {
      throw new Error(ERROR.length);
    }
    origin = path.normalize(origin);
    target = path.normalize(target);
    if (!fs.existsSync(origin)) {
      throw new Error("'" + origin + "' is invalid");
    }
    isDir = fs.statSync(origin).isDirectory();
    type = isDir ? 'dir' : 'file';
    if ((ref = $$.os) === 'windows' || ref === 'linux') {
      origin = path.normalize("" + $$.base + path.sep + origin);
    }
    yield new Promise(function(resolve) {
      return fs.symlink(origin, target, type, function(err) {
        if (err) {
          throw new Error(err);
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
      throw new Error(ERROR.length);
    }
    mkdirp = require('mkdirp');
    src = path.normalize(src);
    yield new Promise(function(resolve) {
      return mkdirp(src, function(err) {
        if (err) {
          throw new Error(err);
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
          throw new Error(ERROR.length);
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
      var a, args, method, option, ref, source, suffix, target;
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
                throw new Error(ERROR.type);
            }
            break;
          case 3:
            return args;
          default:
            throw new Error(ERROR.length);
        }
      })(), source = ref[0], target = ref[1], option = ref[2];
      source = _normalizePath(source);
      suffix = path.extname(source[0]).replace(/\./, '');
      if (!suffix.length) {
        throw new Error('invalid suffix');
      }
      method = (function() {
        switch (suffix) {
          case 'yml':
            return 'yaml';
          case 'styl':
            return 'stylus';
          default:
            return suffix;
        }
      })();
      target || (target = path.dirname(source[0]).replace(/\*/g, ''));
      target = path.normalize(target);
      option = _.extend({
        regenerator: false,
        minify: true
      }, option);
      yield fn[method](source, target, option);
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
    fn.yaml = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(yaml()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.stylus = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(stylus({
          compress: option.minify
        })).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.css = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.css')).pipe(using()).pipe(gulpif(option.minify, cleanCss())).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.coffee = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(include()).pipe(coffee()).pipe(gulpif(option.regenerator, regenerator())).pipe(gulpif(option.minify, uglify())).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.js = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.js')).pipe(using()).pipe(gulpif(option.regenerator, regenerator())).pipe(gulpif(option.minify, uglify())).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    return fn.jade = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(jade({
          pretty: !option.minify
        })).pipe(gulp.dest(target)).on('end', function() {
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
