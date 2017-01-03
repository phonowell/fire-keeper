(function() {
  var $, $$, $p, Promise, _, _coffee, _jade, _stylus, _uglify, _yaml, cleanCss, co, coffee, coffeelint, del, gulp, gulpif, ignore, include, jade, livereload, plumber, replace, stylus, uglify, using, yaml,
    slice = [].slice;

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  gulp = require('gulp');

  module.exports = $$ = {};

  $$.library = {
    $: $,
    _: _,
    Promise: Promise,
    gulp: gulp
  };

  $p = $$.plugin = require('gulp-load-plugins')();

  del = $p.del = require('del');

  $p.yargs = require('yargs');

  using = $p.using, plumber = $p.plumber, ignore = $p.ignore, include = $p.include, replace = $p.replace, cleanCss = $p.cleanCss, coffeelint = $p.coffeelint, livereload = $p.livereload;

  gulpif = $p["if"];

  _jade = $p.jade;

  _coffee = $p.coffee;

  _stylus = $p.stylus;

  _yaml = $p.yaml;

  jade = function() {
    return _jade({
      pretty: false
    });
  };

  coffee = function() {
    return _coffee({
      map: false
    });
  };

  stylus = function() {
    return _stylus({
      compress: true
    });
  };

  yaml = function() {
    return _yaml({
      safe: true
    });
  };

  _uglify = $p.uglify;

  uglify = function() {
    return gulpif(!$$.config('useHarmony'), _uglify());
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
        throw 'invalid arguments length';
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
    var fn, namespace;
    namespace = '__data__';
    fn = $$.config = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      switch (args.length) {
        case 1:
          return fn.get.apply(fn, args);
        case 2:
          return fn.set.apply(fn, args);
        default:
          throw 'invalid arguments length';
      }
    };
    fn[namespace] = {};
    fn.get = function(key) {
      return fn[namespace][key];
    };
    return fn.set = function(key, value) {
      return fn[namespace][key] = value;
    };
  })();

  (function() {
    var fn;
    fn = $$.compile = co(function*(source, target) {
      var method, suffix;
      if (!~source.search(/\./)) {
        throw 'got no suffix';
      }
      suffix = source.replace(/.*\./, '');
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
      target || (target = $$.getBase(source));
      yield fn[method](source, target);
      return $.info('compile', "compiled '" + source + "' to '" + target + "/'");
    });
    fn.yaml = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(yaml()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.stylus = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(stylus()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.css = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.css')).pipe(using()).pipe(cleanCss()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.coffee = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(include()).pipe(coffee()).pipe(uglify()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.js = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.js')).pipe(using()).pipe(uglify()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    return fn.jade = function(source, target) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(using()).pipe(jade()).pipe(gulp.dest(target)).on('end', function() {
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

  $$.copy = co(function*(source, target) {
    target || (target = './');
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
          throw 'invalid arguments length';
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

  $$.createFolder = function(path) {
    return new Promise(function(resolve) {
      var fs;
      fs = require('fs');
      fs.mkdirSync(path);
      $.info('create', "create '" + path + "'");
      return resolve();
    });
  };

}).call(this);
