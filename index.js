(function() {
  var $, $$, $p, ERROR, Promise, _, _coffee, _yaml, changed, cleanCss, co, coffee, coffeelint, del, gulp, gulpif, ignore, include, jade, livereload, plumber, regenerator, replace, stylus, uglify, using, yaml, zip,
    slice = [].slice;

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  gulp = require('gulp');

  module.exports = $$ = {};

  ERROR = {
    length: 'invalid arguments length',
    type: 'invalid arguments type'
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
    var key, list;
    list = [];
    for (key in gulp.tasks) {
      list.push(key);
    }
    list.sort();
    return $.info('task', list.join(', '));
  });

  $$.task('noop', function() {
    return null;
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
      source = (function() {
        switch ($.type(source)) {
          case 'array':
            return source;
          case 'string':
            return [source];
          default:
            throw new Error(ERROR.type);
        }
      })();
      source = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          a = source[i];
          results.push(a.replace(/\\/g, '/'));
        }
        return results;
      })();
      if (!~source[0].search(/\./)) {
        throw new Error('invalid suffix');
      }
      suffix = source[0].replace(/.*\./, '');
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
      target || (target = $$.getBase(source[0]));
      option = _.extend({
        regenerator: false,
        minify: true
      }, option);
      yield fn[method](source, target, option);
      return $.info('compile', "compiled '" + (source.join("', '")) + "' to '" + (_.trim(target, '/')) + "/'");
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

  $$.divide = function() {
    return $.log($$.divide['__string__']);
  };

  $$.divide['__string__'] = _.trim(_.repeat('- ', 16));

  $$.watch = $p.watch;

  $$.reload = function() {
    livereload.listen();
    return $$.watch($$.path.source + "/**/*.css").pipe(livereload());
  };

  $$.copy = co(function*(source, target) {
    if (target == null) {
      target = './';
    }
    if (!source) {
      throw new Error(ERROR.length);
    }
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    return $.info('copy', "copied '" + source + "' to '" + target + "'");
  });

  $$["delete"] = co(function*(source) {
    yield del(source, {
      force: true
    });
    return $.info('delete', "deleted '" + ($.type(source) === 'array' ? source.join("', '") : source) + "'");
  });

  $$.remove = $$["delete"];

  $$.replace = co(function*() {
    var args, pathSource, pathTarget, ref, replacement, target;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (args.length) {
        case 3:
          return [args[0], $$.getBase(args[0]), args[1], args[2]];
        case 4:
          return args;
        default:
          throw new Error(ERROR.length);
      }
    })(), pathSource = ref[0], pathTarget = ref[1], target = ref[2], replacement = ref[3];
    yield new Promise(function(resolve) {
      return gulp.src(pathSource).pipe(plumber()).pipe(using()).pipe(replace(target, replacement)).pipe(gulp.dest(pathTarget)).on('end', function() {
        return resolve();
      });
    });
    return $.info('replace', "replaced '" + target + "' to '" + replacement + "', from '" + pathSource + "' to '" + pathTarget + "/'");
  });

  $$.getBase = function(path) {
    var arr;
    if (~path.search(/\*/)) {
      return path.replace(/\/\*.*/, '');
    }
    if (~path.search(/\//)) {
      arr = path.split('/');
      arr.pop();
      return arr.join('/');
    }
    return '';
  };

  $$.shell = function(cmd) {
    return new Promise(function(resolve) {
      return $.shell(cmd, function() {
        return resolve();
      });
    });
  };

  $$.makeDirectory = co(function*(path) {
    var mkdirp;
    if (!path) {
      throw new Error(ERROR.length);
    }
    mkdirp = require('mkdirp');
    yield new Promise(function(resolve) {
      return mkdirp(path, function(err) {
        if (err) {
          throw new Error(err);
        }
        return resolve();
      });
    });
    return $.info('create', "create '" + path + "'");
  });

  $$.createFolder = $$.makeDirectory;

  $$.link = co(function*(origin, target) {
    var fs, isDir, type;
    if (!(origin && target)) {
      throw new Error(ERROR.length);
    }
    fs = require('fs');
    if (!fs.existsSync(origin)) {
      throw new Error("'" + origin + "' is invalid");
    }
    isDir = fs.statSync(origin).isDirectory();
    type = isDir ? 'dir' : 'file';
    if ($$.os === 'windows') {
      origin = $$.base + "\\" + (origin.replace(/^\.\//, ''));
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
    return $.info('link', "linked " + type + " '" + origin + "' to '" + target + "'");
  });

  $$.zip = co(function*() {
    var args, filename, origin, ref, target;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (args.length) {
        case 2:
          return [args[0], './', args[1]];
        case 3:
          return args;
        default:
          throw new Error(ERROR.length);
      }
    })(), origin = ref[0], target = ref[1], filename = ref[2];
    yield new Promise(function(resolve) {
      return gulp.src(origin).pipe(plumber()).pipe(using()).pipe(zip(filename)).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    return $.info('zip', "zipped '" + origin + "' to '" + target + "' as '" + filename + "'");
  });

}).call(this);
