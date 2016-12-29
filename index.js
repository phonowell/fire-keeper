(function() {
  var $, $$, Promise, _, _coffee, _jade, _stylus, _uglify, _yaml, co, coffee, coffeelint, del, gulpif, ignore, include, jade, minCss, plumber, reload, rename, replace, search, stylus, uglify, watch, yaml;

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  del = require('del');

  require('gulp-util');

  watch = require('gulp-watch');

  plumber = require('gulp-plumber');

  ignore = require('gulp-plumber');

  rename = require('gulp-rename');

  include = require('gulp-include');

  search = require('gulp-search');

  replace = require('gulp-replace');

  gulpif = require('gulp-if');

  _jade = require('gulp-jade');

  _coffee = require('gulp-coffee');

  _stylus = require('gulp-stylus');

  _yaml = require('gulp-yaml');

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

  _uglify = require('gulp-uglify');

  uglify = function() {
    return gulpif(!~search(/yield /), _uglify());
  };

  minCss = require('gulp-clean-css');

  coffeelint = require('gulp-coffeelint');

  reload = require('gulp-livereload');

  $$ = function(arg) {
    return $$.use(arg);
  };

  $$.use = function(gulp) {
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
    $$.divide = function() {
      return $.log($$.divide['__string__']);
    };
    $$.divide['__string__'] = _.trim(_.repeat('- ', 16));
    (function() {
      var fn;
      fn = $$.listen = function(list) {
        var a, j, len, results;
        if ($.type(list) !== 'array') {
          list = [list];
        }
        results = [];
        for (j = 0, len = list.length; j < len; j++) {
          a = list[j];
          if (~a.search(/\.coffee/)) {
            results.push(fn.coffee(a));
          } else if (~a.search(/\.styl/)) {
            results.push(fn.stylus(a));
          } else if (~a.search(/\.yml/)) {
            results.push(fn.yaml(a));
          } else {
            throw 'type error';
          }
        }
        return results;
      };
      fn.upper = function(src) {
        var arr;
        arr = src.split('/');
        arr.pop();
        return arr.join('/');
      };
      fn.coffee = function(src) {
        var deb;
        deb = _.debounce(function() {
          var path;
          return gulp.src(path = fn.upper(src)).pipe(plumber()).pipe(include()).pipe(coffee()).pipe(gulp.dest(path));
        }, 1e3);
        return watch(path + "/include/**/*.coffee", deb);
      };
      fn.stylus = function(src) {
        var deb;
        deb = _.debounce(function() {
          var path;
          return gulp.src(path = fn.upper(src)).pipe(plumber()).pipe(stylus()).pipe(gulp.dest(path));
        }, 1e3);
        return watch(path + "/include/**/*.coffee", deb);
      };
      return fn.yaml = function(src) {
        var deb;
        deb = _.debounce(function() {
          var path;
          return gulp.src(path = fn.upper(src)).pipe(plumber()).pipe(yaml()).pipe(gulp.dest(path));
        }, 1e3);
        return watch(path + "/include/**/*.yml", deb);
      };
    })();
    $$.reload = function() {
      reload.listen();
      return watch($$.path.source + "/**/*.css").pipe(reload());
    };
    (function() {
      var fn;
      fn = $$.build = function(map) {
        return fn.reduce(map);
      };
      fn['__map__'] = {};
      fn.reduce = co(function(map) {
        var i, key, list, step;
        list = (function() {
          var results;
          results = [];
          for (key in map) {
            results.push(key);
          }
          return results;
        })();
        i = 0;
        return (step = co(function*() {
          var isEnded;
          isEnded = i >= list.length;
          $$.divide();
          $.info('step', "run step <" + (isEnded ? 'callback' : key = list[i]) + ">");
          if (isEnded) {
            return;
          }
          yield (fn.select(key))(map[key]);
          i++;
          return step();
        }))();
      });
      fn.select = function(key) {
        return fn['__map__'][key];
      };
      fn.add = function(key, func) {
        if (fn.select(key)) {
          throw 'function already existed';
        }
        return fn['__map__'][key] = func;
      };
      fn.remove = function(key) {
        return delete fn['__map__'][key];
      };
      fn.add('prepare', co(function*() {
        var path;
        path = $$.path.build;
        yield del(path, {
          force: true
        });
        $.info('mkdir', path);
        return fs.mkdirSync(path);
      }));
      fn.add('copy', function(src) {
        return new Promise(function(resolve) {
          var base;
          base = $$.path.source;
          return gulp.src(src, {
            base: base
          }).pipe(plumber()).pipe(gulp.dest(base)).on('end', function() {
            return resolve();
          });
        });
      });
      fn.add('other', co(function*(list) {
        var a;
        if (list == null) {
          list = [];
        }
        list = _.uniq(list.concat(['png', 'jpg', 'gif', 'json', 'ttf']), true);
        return (yield (fn.select('copy'))((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = list.length; j < len; j++) {
            a = list[j];
            results.push($$.path.source + "/**/*." + a);
          }
          return results;
        })()));
      }));
      fn.add('yaml', co(function*() {
        return (yield $$.compile('secret'));
      }));
      fn.add('stylus', function() {
        return co(function*() {
          return (yield $$.compile('stylus', $$.path.build));
        });
      });
      fn.add('css', co(function*() {
        yield $$.compile('css', $$.path.build);
        return (yield (fn.select('copy'))($$.path.source + "/**/*.min.css"));
      }));
      fn.add('coffee', co(function*() {
        return (yield $$.compile('coffee', $$.path.build));
      }));
      fn.add('js', co(function*() {
        yield $$.compile('js', $$.path.build);
        return (yield (fn.select('copy'))($$.path.source + "/**/*.min.js"));
      }));
      fn.add('jade', co(function*() {
        return (yield $$.compile('jade', $$.path.build));
      }));
      return fn.add('clean', co(function*(list) {
        var a;
        yield del(list, {
          force: true
        });
        return $.info('clean', ((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = list.length; j < len; j++) {
            a = list[j];
            results.push(a);
          }
          return results;
        })()).join(', '));
      }));
    })();
    (function() {
      var fn;
      fn = $$.lint = function(key) {
        return fn[key]();
      };
      return fn.coffee = function() {
        return new Promise(function(resolve) {
          return gulp.src($$.path.coffee).pipe(plumber()).pipe(coffeelint()).pipe(coffeelint.reporter()).on('end', function() {
            return resolve();
          });
        });
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
        target || (target = (function() {
          var arr;
          if (~source.search(/\*/)) {
            return source.replace(/\/\*.*/, '');
          }
          if (~source.search(/\//)) {
            arr = source.split('/');
            arr.pop();
            return arr.join('/');
          }
          return '';
        })());
        yield fn[method](source, target);
        return $.info('compile', "compiled '" + source + "' to '" + target + "/'");
      });
      fn.yaml = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(yaml()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
      fn.stylus = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(stylus()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
      fn.css = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.css')).pipe(minCss()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
      fn.coffee = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(include()).pipe(coffee()).pipe(uglify()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
      fn.js = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(ignore('**/*.min.js')).pipe(uglify()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
      return fn.jade = function(source, target) {
        return new Promise(function(resolve) {
          return gulp.src(source).pipe(plumber()).pipe(ignore('**/include/**')).pipe(jade()).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
      };
    })();
    $$.copy = co(function*(source, target) {
      target || (target = './');
      yield new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
      return $.info('copy', "copied '" + source + "' to '" + target + "'");
    });
    return $$["delete"] = co(function*(source) {
      yield del(source, {
        force: true
      });
      return $.info('delete', "deleted '" + ($.type(source) === 'array' ? source.join("', '") : source) + "'");
    });
  };

  module.exports = $$;

}).call(this);
