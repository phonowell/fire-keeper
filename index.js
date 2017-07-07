(function() {
  var $, $$, $p, Promise, _, _cloneGitHub, _error, _formatSource, changed, cleanCss, co, coffee, coffeelint, composer, del, fs, gulp, gulpif, htmlmin, ignore, include, livereload, markdown, path, plumber, pug, rename, replace, sourcemaps, string, stylint, stylus, uglify, uglifyjs, using, yaml, zip,
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
        case 'extname':
          return 'invalid extname';
        case 'length':
          return 'invalid argument length';
        case 'type':
          return 'invalid argument type';
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

  using = $p.using, plumber = $p.plumber, ignore = $p.ignore, changed = $p.changed, include = $p.include, replace = $p.replace, rename = $p.rename, yaml = $p.yaml, pug = $p.pug, markdown = $p.markdown, coffee = $p.coffee, stylus = $p.stylus, sourcemaps = $p.sourcemaps, htmlmin = $p.htmlmin, cleanCss = $p.cleanCss, zip = $p.zip, coffeelint = $p.coffeelint, stylint = $p.stylint, livereload = $p.livereload;

  gulpif = $p["if"];

  uglifyjs = require('uglify-es');

  composer = require('gulp-uglify/composer');

  uglify = $p.uglify = composer(uglifyjs, console);

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

  $$.path.pug = $$.path.source + "/**/*.pug";

  $$.path.stylus = $$.path.source + "/**/*.styl";

  $$.path.coffee = $$.path.source + "/**/*.coffee";

  $$.path.yaml = $$.path.secret + "/**/*.yml";


  /*
  
    _cloneGitHub(name)
    _formatSource(source)
   */

  _cloneGitHub = co(function*(name) {
    if (fs.existsSync($$.base + "/../" + name)) {
      return;
    }
    return (yield $$.shell("git clone https://github.com/phonowell/" + name + ".git " + $$.base + "/../" + name));
  });

  _formatSource = function(source) {
    var i, len, results, src;
    source = (function() {
      switch ($.type(source)) {
        case 'array':
          return source;
        case 'string':
          return [source];
        default:
          throw _error('type');
      }
    })();
    results = [];
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      results.push(path.normalize(src));
    }
    return results;
  };

  $$.task = function() {
    var arg;
    arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    switch (arg.length) {
      case 1:
        return gulp.tasks[arg[0]].fn;
      case 2:
        return gulp.task.apply(gulp, arg);
      default:
        throw _error('length');
    }
  };


  /*
  
    default
    gurumin
    kokoro
    noop
    update
   */

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

  $$.task('gurumin', co(function*() {
    yield _cloneGitHub('gurumin');
    yield $$.remove($$.base + "/source/gurumin");
    return (yield $$.link("./../gurumin/source", $$.base + "/source/gurumin"));
  }));

  $$.task('kokoro', co(function*() {
    var LIST, i, len, source;
    yield _cloneGitHub('kokoro');
    LIST = ['.gitignore', '.npmignore', 'coffeelint.yml', 'stylintrc.yml', 'license.md'];
    for (i = 0, len = LIST.length; i < len; i++) {
      source = LIST[i];
      yield $$.remove($$.base + "/" + source);
      yield $$.copy($$.base + "/../kokoro/" + source, './');
      yield $$.shell("git add -f " + $$.base + "/" + source);
    }
    yield $$.compile($$.base + "/coffeelint.yml");
    yield $$.compile($$.base + "/stylintrc.yml");
    yield $$.copy($$.base + "/stylintrc.json", $$.base + "/", {
      prefix: '.',
      extname: ''
    });
    return (yield $$.remove($$.base + "/stylintrc.json"));
  }));

  $$.task('noop', function() {
    return null;
  });

  $$.task('update', co(function*() {
    var key, list, p, pkg;
    pkg = $$.base + "/package.json";
    yield $$.backup(pkg);
    p = require(pkg);
    list = [];
    for (key in p.devDependencies) {
      list.push("cnpm r --save-dev " + key);
      list.push("cnpm i --save-dev " + key);
    }
    for (key in p.dependencies) {
      list.push("cnpm r --save " + key);
      list.push("cnpm i --save " + key);
    }
    yield $$.shell(list);
    return (yield $$.remove(pkg + ".bak"));
  }));

  $$.copy = co(function*() {
    var arg, msg, name, ref, source, target;
    arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (arg.length) {
        case 2:
          return [arg[0], arg[1], null];
        case 3:
          return arg;
        default:
          throw _error('length');
      }
    })(), source = ref[0], target = ref[1], name = ref[2];
    source = _formatSource(source);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(!!name, rename(name))).pipe(gulp.dest(function(e) {
        return target || e.base;
      })).on('end', function() {
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
    var isDir, type;
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
    origin = path.normalize("" + $$.base + path.sep + origin);
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

  $$.mkdir = co(function*(src) {
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

  $$.remove = co(function*(source) {
    var a;
    source = _formatSource(source);
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

  $$.rm = $$.remove;

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
    fn = co(function*() {
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
      source = _formatSource(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw _error('extname');
      }
      method = (function() {
        switch (extname) {
          case 'yaml':
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
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(stylus(option)).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.css = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(gulpif(option.minify, cleanCss())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.coffee = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(include()).pipe(coffee(option)).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.js = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.pug = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.pretty == null) {
          option.pretty = !option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn.markdown = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.sanitize == null) {
          option.sanitize = true;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(markdown(option)).pipe(gulpif(option.minify, htmlmin({
          collapseWhitespace: true
        }))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    return $$.compile = fn;
  })();

  (function() {
    var fn;
    fn = function(source) {
      var extname, method;
      source = _formatSource(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw _error('extname');
      }
      method = (function() {
        switch (extname) {
          case 'coffee':
            return extname;
          case 'styl':
            return 'stylus';
          default:
            throw _error('extname');
        }
      })();
      return fn[method](source);
    };
    fn.coffee = function(source) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(coffeelint()).pipe(coffeelint.reporter()).on('end', function() {
          return resolve();
        });
      });
    };
    fn.stylus = function(source) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(stylint()).pipe(stylint.reporter()).on('end', function() {
          return resolve();
        });
      });
    };
    return $$.lint = fn;
  })();

  $$.zip = co(function*(source, target) {
    var dirname, filename;
    if (target == null) {
      target = './zip.zip';
    }
    source = _formatSource(source);
    target = path.normalize(target);
    dirname = path.dirname(target);
    filename = path.basename(target);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(zip(filename)).pipe(gulp.dest(dirname)).on('end', function() {
        return resolve();
      });
    });
    return $.info('zip', "zipped '" + source + "' to '" + target + "'");
  });


  /*
  
    $$.backup(source)
    $$.delay(time)
    $$.divide()
    $$.recover(source)
    $$.reload(source)
    $$.shell(cmd)
    $$.watch()
   */

  $$.backup = co(function*(source) {
    var extname, i, len, src, suffix;
    source = _formatSource(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      suffix = path.extname(src);
      extname = '.bak';
      $.info.isSilent = true;
      yield $$.copy(src, null, {
        suffix: suffix,
        extname: extname
      });
      $.info.isSilent = false;
    }
    return $.info('backup', "backed up '" + source + "'");
  });

  $$.delay = co(function*(time) {
    if (time == null) {
      time = 0;
    }
    yield new Promise(function(resolve) {
      return $.next(time, function() {
        return resolve();
      });
    });
    return $.info('delay', "delayed '" + time + " ms'");
  });

  $$.divide = function() {
    return $.log($$.divide['__string__']);
  };

  $$.divide['__string__'] = _.trim(_.repeat('- ', 16));

  $$.recover = co(function*(source) {
    var bak, basename, i, len, src;
    source = _formatSource(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      bak = src + ".bak";
      if (!fs.existsSync(bak)) {
        continue;
      }
      basename = path.basename(src);
      $.info.isSilent = true;
      yield $$.remove(src);
      yield $$.copy(bak, null, basename);
      yield $$.remove(bak);
      $.info.isSilent = false;
    }
    return $.info('recover', "recovered '" + source + "'");
  });

  $$.reload = function(source) {
    source = _formatSource(source);
    livereload.listen();
    return $$.watch(source).pipe(livereload());
  };

  $$.shell = $.shell;

  $$.watch = $p.watch;

}).call(this);
