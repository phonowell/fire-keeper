(function() {
  var $, $$, $p, Promise, _, _cloneGitHub, _error, _formatPath, _normalizePath, changed, cleanCss, co, coffee, coffeelint, composer, del, download, fs, fse, gulp, gulpif, htmlmin, ignore, include, livereload, markdown, path, plumber, pug, rename, replace, sourcemaps, string, stylint, stylus, uglify, uglifyjs, unzip, using, yaml, zip,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  fs = require('fs');

  fse = require('fs-extra');

  $ = require('node-jquery-extend');

  _ = $._;

  Promise = require('bluebird');

  co = Promise.coroutine;

  gulp = require('gulp');

  module.exports = $$ = {};

  $$.library = {
    $: $,
    _: _,
    fse: fse,
    gulp: gulp,
    Promise: Promise
  };

  $p = $$.plugin = require('gulp-load-plugins')();

  del = $p.del = require('del');

  download = $p.download = require('download');

  $p.yargs = require('yargs');

  changed = $p.changed, cleanCss = $p.cleanCss, coffee = $p.coffee, coffeelint = $p.coffeelint, htmlmin = $p.htmlmin, ignore = $p.ignore, include = $p.include, livereload = $p.livereload, markdown = $p.markdown, plumber = $p.plumber, pug = $p.pug, rename = $p.rename, replace = $p.replace, stylint = $p.stylint, stylus = $p.stylus, sourcemaps = $p.sourcemaps, unzip = $p.unzip, using = $p.using, yaml = $p.yaml, zip = $p.zip;

  gulpif = $p["if"];

  uglifyjs = require('uglify-es');

  composer = require('gulp-uglify/composer');

  uglify = $p.uglify = composer(uglifyjs, console);


  /*
  
    argv
    os
    path
   */

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

  $$.path = {
    base: process.cwd(),
    home: require('os').homedir()
  };


  /*
  
    _cloneGitHub(name)
    _error(msg)
    _formatPath(source)
    _normalizePath(source)
   */

  _cloneGitHub = co(function*(name) {
    var source;
    source = _normalizePath("./../" + name);
    if ((yield $$.isExisted(source))) {
      return;
    }
    return (yield $$.shell("git clone https://github.com/phonowell/" + name + ".git " + $$.path.base + "/../" + name));
  });

  _error = function(msg) {
    return new Error((function() {
      switch (msg) {
        case 'extname':
          return 'invalid extname';
        case 'length':
          return 'invalid argument length';
        case 'source':
          return 'invalid source';
        case 'target':
          return 'invalid target';
        case 'type':
          return 'invalid argument type';
        default:
          return msg;
      }
    })());
  };

  _formatPath = function(source) {
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
      results.push(_normalizePath(src));
    }
    return results;
  };

  _normalizePath = function(source) {
    var isIgnore;
    if ($.type(source) !== 'string') {
      return null;
    }
    if (source[0] === '!') {
      isIgnore = true;
      source = source.slice(1);
    }
    source = source.replace(/\\/g, '/');
    source = (function() {
      switch (source[0]) {
        case '.':
          return source.replace(/\./, $$.path.base);
        case '~':
          return source.replace(/~/, $$.path.home);
        default:
          return source;
      }
    })();
    source = path.normalize(source);
    if (!path.isAbsolute(source)) {
      source = "" + $$.path.base + path.sep + source;
    }
    if (isIgnore) {
      source = "!" + source;
    }
    return source;
  };


  /*
  
    task(name, [fn])
   */

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
  
    default()
    gurumin()
    kokoro()
    noop()
    update([target])
   */

  $$.task('default', function() {
    var key, list, task;
    list = [];
    for (key in gulp.tasks) {
      list.push(key);
    }
    list.sort();
    return $.info('task', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = list.length; i < len; i++) {
        task = list[i];
        results.push("'" + task + "'");
      }
      return results;
    })()).join(', '));
  });

  $$.task('gurumin', co(function*() {
    yield _cloneGitHub('gurumin');
    yield $$.remove('./source/gurumin');
    return (yield $$.link('./../gurumin/source', './source/gurumin'));
  }));

  $$.task('kokoro', co(function*() {
    var LIST, filename, i, isSame, len, source, target;
    yield _cloneGitHub('kokoro');
    LIST = ['coffeelint.yml', 'stylintrc.yml'];
    yield $$.remove(LIST);
    LIST = ['.gitignore', '.npmignore', 'coffeelint.yaml', 'stylintrc.yaml', 'license.md'];
    for (i = 0, len = LIST.length; i < len; i++) {
      filename = LIST[i];
      source = "./../kokoro/" + filename;
      target = "./" + filename;
      isSame = (yield $$.isSame([source, target]));
      if (isSame === true) {
        continue;
      }
      yield $$.remove(target);
      yield $$.copy(source, './');
      yield $$.shell("git add -f " + $$.path.base + "/" + filename);
    }
    yield $$.compile('./coffeelint.yaml');
    yield $$.compile('./stylintrc.yaml');
    yield $$.copy('./stylintrc.json', './', {
      prefix: '.',
      extname: ''
    });
    return (yield $$.remove('./stylintrc.json'));
  }));

  $$.task('noop', function() {
    return null;
  });

  $$.task('update', co(function*() {
    var key, list, npm, p, pkg, res, target;
    yield $$.remove('./package-lock.json');
    npm = (function() {
      switch ($$.os) {
        case 'linux':
        case 'macos':
          return 'npm';
        case 'windows':
          return 'cnpm';
        default:
          throw new Error('invalid os');
      }
    })();
    target = $$.argv.target;
    pkg = './package.json';
    yield $$.backup(pkg);
    p = (yield $$.read(pkg));
    list = [];
    for (key in p.devDependencies) {
      if (target) {
        if (key !== target) {
          continue;
        }
      }
      list.push(npm + " r --save-dev " + key);
      list.push(npm + " i --save-dev " + key);
    }
    for (key in p.dependencies) {
      if (target) {
        if (key !== target) {
          continue;
        }
      }
      list.push(npm + " r --save " + key);
      list.push(npm + " i --save " + key);
    }
    res = (yield $$.shell(list));
    if (res) {
      return (yield $$.remove(pkg + ".bak"));
    } else {
      $.info('update', 'failed');
      yield $$.recover(pkg);
      return (yield $$.shell('npm i'));
    }
  }));


  /*
  
    backup(source)
    recover(source)
   */

  $$.backup = co(function*(source) {
    var extname, i, len, src, suffix;
    source = _formatPath(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      suffix = path.extname(src);
      extname = '.bak';
      $.info.pause('$$.backup');
      yield $$.copy(src, null, {
        suffix: suffix,
        extname: extname
      });
      $.info.resume('$$.backup');
    }
    $.info('backup', "backed up '" + source + "'");
    return $$;
  });

  $$.recover = co(function*(source) {
    var bak, basename, i, len, src;
    source = _formatPath(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      bak = src + ".bak";
      if (!fs.existsSync(bak)) {
        continue;
      }
      basename = path.basename(src);
      $.info.pause('$$.recover');
      yield $$.remove(src);
      yield $$.copy(bak, null, basename);
      yield $$.remove(bak);
      $.info.resume('$$.recover');
    }
    $.info('recover', "recovered '" + source + "'");
    return $$;
  });


  /*
  
    compile(source, [target], [option])
   */

  (function() {
    var fn;
    fn = co(function*() {
      var arg, compiler, extname, method, option, ref, source, target;
      arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref = (function() {
        switch (arg.length) {
          case 1:
            return [arg[0], null, {}];
          case 2:
            switch ($.type(arg[1])) {
              case 'object':
                return [arg[0], null, arg[1]];
              case 'string':
                return [arg[0], arg[1], {}];
              default:
                throw _error('type');
            }
            break;
          case 3:
            return arg;
          default:
            throw _error('length');
        }
      })(), source = ref[0], target = ref[1], option = ref[2];
      source = _formatPath(source);
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
      target = _normalizePath(target);
      option = _.extend({
        map: false,
        minify: true
      }, option);
      compiler = fn[method];
      if (!compiler) {
        throw _error("invalid extname: '." + extname + "'");
      }
      yield compiler(source, target, option);
      $.info('compile', "compiled '" + source + "' to '" + target + "'");
      return $$;
    });

    /*
    
      coffee(source, target, option)
      css(source, target, option)
      js(source, target, option)
      markdown(source, target, option)
      pug(source, target, option)
      stylus(source, target, option)
      yaml(source, target, option)
     */
    fn.coffee = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(include()).pipe(coffee(option)).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
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
    fn.js = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(option.map, sourcemaps.init())).pipe(gulpif(option.minify, uglify())).pipe(gulpif(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
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
    return $$.compile = fn;
  })();


  /*
  
    download(source, target, [option])
   */

  $$.download = co(function*() {
    var arg, msg, option, ref, source, target;
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
    })(), source = ref[0], target = ref[1], option = ref[2];
    target = _normalizePath(target);
    if ($.type(option) === 'string') {
      option = {
        filename: option
      };
    }
    yield download(source, target, option);
    msg = "downloaded '" + source + "' to '" + target + "'";
    if (option) {
      msg += ", as '" + ($.parseString(option)) + "'";
    }
    $.info('download', msg);
    return $$;
  });


  /*
  
    copy(source, target, [option])
    isChanged(source)
    isExisted(source)
    isSame(source, target)
    link(source, target)
    mkdir(source)
    read(source)
    remove(source)
    rename(source, option)
    stat(source)
    write(source, data)
   */

  $$.copy = co(function*() {
    var arg, msg, option, ref, source, target;
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
    })(), source = ref[0], target = ref[1], option = ref[2];
    source = _formatPath(source);
    if (target) {
      target = _normalizePath(target);
    }
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(!!option, rename(option))).pipe(gulp.dest(function(e) {
        return target || e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    msg = "copied '" + source + "' to '" + target + "'";
    if (option) {
      msg += ", as '" + ($.parseString(option)) + "'";
    }
    $.info('copy', msg);
    return $$;
  });

  $$.isChanged = co(function*(source) {
    var contSource, map, md5, md5Source, pathMap, res;
    md5 = require('blueimp-md5');
    source = _normalizePath(source);
    pathMap = './temp/fire-keeper/map-file-md5.json';
    if (!source) {
      return false;
    }
    contSource = (yield $$.read(source));
    if (!contSource) {
      return false;
    }
    md5Source = md5(contSource.toString());
    map = (yield $$.read(pathMap));
    map || (map = {});
    res = md5Source !== map[source];
    map[source] = md5Source;
    $.info.pause('$$.isChanged');
    yield $$.write(pathMap, map);
    $.info.resume('$$.isChanged');
    return res;
  });

  $$.isExisted = co(function*(source) {
    var i, len, src;
    source = _formatPath(source);
    if (!source.length) {
      return false;
    }
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      if (!(yield fse.pathExists(src))) {
        return false;
      }
    }
    return true;
  });

  $$.isSame = co(function*(source) {
    var TOKEN, cont, i, len, md5, src, token;
    md5 = require('blueimp-md5');
    source = _formatPath(source);
    if (!source.length) {
      return false;
    }
    TOKEN = null;
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      cont = (yield $$.read(src));
      if (!cont) {
        return false;
      }
      token = md5(cont.toString());
      if (!TOKEN) {
        TOKEN = token;
        continue;
      }
      if (token !== TOKEN) {
        return false;
      }
    }
    return true;
  });

  $$.link = co(function*(source, target) {
    if (!(source && target)) {
      throw _error('length');
    }
    source = _normalizePath(source);
    target = _normalizePath(target);
    yield fse.ensureSymlink(source, target);
    $.info('link', "linked '" + source + "' to '" + target + "'");
    return $$;
  });

  $$.mkdir = co(function*(source) {
    var listPromise, src;
    if (!source) {
      throw _error('length');
    }
    source = _formatPath(source);
    listPromise = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = source.length; i < len; i++) {
        src = source[i];
        results.push(fse.ensureDir(src));
      }
      return results;
    })();
    yield Promise.all(listPromise);
    $.info('create', "created '" + source + "'");
    return $$;
  });

  $$.read = co(function*(source) {
    var res;
    source = _normalizePath(source);
    if (!(yield $$.isExisted(source))) {
      $.info('file', "'" + source + "' not existed");
      return null;
    }
    res = (yield new Promise(function(resolve) {
      return fs.readFile(source, function(err, data) {
        if (err) {
          throw err;
        }
        return resolve(data);
      });
    }));
    $.info('file', "read '" + source + "'");
    return res = (function() {
      switch (path.extname(source).slice(1)) {
        case 'json':
          return $.parseJson(res);
        case 'txt':
          return $.parseString(res);
        default:
          return res;
      }
    })();
  });

  $$.remove = co(function*(source) {
    source = _formatPath(source);
    yield del(source, {
      force: true
    });
    $.info('remove', "removed '" + source + "'");
    return $$;
  });

  $$.rename = co(function*(source, option) {
    source = _formatPath(source);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
        return e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    $.info.pause('$$.rename');
    yield $$.remove(source);
    $.info.resume('$$.rename');
    $.info('file', "renamed '" + source + "' as '" + ($.parseString(option)) + "'");
    return $$;
  });

  $$.stat = co(function*(source) {
    source = _normalizePath(source);
    if (!(yield $$.isExisted(source))) {
      $.info('file', "'" + source + "' not existed");
      return null;
    }
    return new Promise(function(resolve) {
      return fs.stat(source, function(err, stat) {
        if (err) {
          throw err;
        }
        return resolve(stat);
      });
    });
  });

  $$.write = co(function*(source, data, option) {
    var ref;
    source = _normalizePath(source);
    if (ref = $.type(data), indexOf.call('array object'.split(' '), ref) >= 0) {
      data = $.parseString(data);
    }
    yield fse.outputFile(source, data, option);
    $.info('file', "wrote '" + source + "'");
    return $$;
  });


  /*
  
    lint(source)
   */

  (function() {
    var fn;
    fn = co(function*(source) {
      var extname, method;
      source = _formatPath(source);
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
      yield fn[method](source);
      return $$;
    });

    /*
    
      coffee(source)
      stylus(source)
     */
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


  /*
  
    replace(pathSource, [pathTarget], target, replacement)
   */

  $$.replace = co(function*() {
    var arg, pathSource, pathTarget, ref, replacement, target;
    arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (arg.length) {
        case 3:
          return [arg[0], null, arg[1], arg[2]];
        case 4:
          return arg;
        default:
          throw _error('length');
      }
    })(), pathSource = ref[0], pathTarget = ref[1], target = ref[2], replacement = ref[3];
    pathSource = _formatPath(pathSource);
    pathTarget || (pathTarget = path.dirname(pathSource[0]).replace(/\*/g, ''));
    pathTarget = _normalizePath(pathTarget);
    yield new Promise(function(resolve) {
      return gulp.src(pathSource).pipe(plumber()).pipe(using()).pipe(replace(target, replacement)).pipe(gulp.dest(pathTarget)).on('end', function() {
        return resolve();
      });
    });
    $.info('replace', "replaced '" + target + "' to '" + replacement + "', in '" + pathSource + "', output to '" + pathTarget + "'");
    return $$;
  });


  /*
  
    unzip(source, [target])
    zip(source, [target], [option])
   */

  $$.unzip = co(function*() {
    var arg, ref, source, target;
    arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (arg.length) {
        case 1:
          return [arg[0], null];
        case 2:
          return arg;
        default:
          throw _error('length');
      }
    })(), source = ref[0], target = ref[1];
    source = _formatPath(source);
    target || (target = (path.dirname(source[0])) + "/" + (path.basename(source[0], '.zip')));
    target = _normalizePath(target);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(unzip()).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    $.info('zip', "unzipped '" + source + "' to '" + target + "'");
    return $$;
  });

  $$.zip = co(function*() {
    var arg, filename, option, ref, source, target;
    arg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = (function() {
      switch (arg.length) {
        case 1:
          return [arg[0], null, {}];
        case 2:
          return [arg[0], arg[1], {}];
        case 3:
          return arg;
        default:
          throw _error('length');
      }
    })(), source = ref[0], target = ref[1], option = ref[2];
    source = _formatPath(source);
    target || (target = path.dirname(source[0]));
    target = _normalizePath(target);
    filename = (function() {
      switch ($.type(option)) {
        case 'object':
          return option.filename;
        case 'string':
          return option;
        default:
          return null;
      }
    })();
    filename || (filename = (path.basename(path.resolve(target)) || 'zip') + ".zip");
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(zip(filename)).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    $.info('zip', "zipped '" + source + "' to '" + target + "', named as '" + filename + "'");
    return $$;
  });


  /*
  
    delay([time])
    reload(source)
    shell(cmd)
    watch(source)
    yargs()
   */

  $$.delay = $.delay;

  $$.reload = function(source) {
    if (!source) {
      throw new Error('invalid source');
    }
    source = _formatPath(source);
    livereload.listen();
    $$.watch(source).pipe(livereload());
    return $$;
  };

  $$.shell = $.shell;

  $$.watch = $p.watch;

  $$.yargs = $p.yargs;

}).call(this);
