(function() {
  var $, $$, $p, Promise, _, _cloneGitHub, _error, _formatPath, _normalizePath, changed, cleanCss, co, coffee, coffeelint, composer, del, download, fs, gulp, gulpif, htmlmin, ignore, include, livereload, markdown, path, plumber, pug, rename, replace, sourcemaps, string, stylint, stylus, uglify, uglifyjs, unzip, using, yaml, zip,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  fs = require('fs');

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
    var src;
    src = source.replace(/\\/g, '/');
    src = (function() {
      switch (src[0]) {
        case '.':
          return src.replace(/\./, $$.path.base);
        case '~':
          return src.replace(/~/, $$.path.home);
        default:
          return src;
      }
    })();
    src = path.normalize(src);
    if (path.isAbsolute(src)) {
      return src;
    } else {
      return "" + $$.path.base + path.sep + src;
    }
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
    var LIST, i, len, source;
    yield _cloneGitHub('kokoro');
    LIST = ['coffeelint.yml', 'stylintrc.yml'];
    yield $$.remove(LIST);
    LIST = ['.gitignore', '.npmignore', 'coffeelint.yaml', 'stylintrc.yaml', 'license.md'];
    for (i = 0, len = LIST.length; i < len; i++) {
      source = LIST[i];
      yield $$.remove("./" + source);
      yield $$.copy("./../kokoro/" + source, './');
      yield $$.shell("git add -f " + $$.path.base + "/" + source);
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
      $.info.isSilent = true;
      yield $$.copy(src, null, {
        suffix: suffix,
        extname: extname
      });
      $.info.isSilent = false;
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
      $.info.isSilent = true;
      yield $$.remove(src);
      yield $$.copy(bak, null, basename);
      yield $$.remove(bak);
      $.info.isSilent = false;
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
  
    copy(source, target, [option])
    cp(source, target, [option])
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

  $$.cp = $$.copy;


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
    if ($.type(option === 'string')) {
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
  
    isExisted(source)
    read(source)
    rename(source, option)
    stat(source)
    write(source, data)
   */

  $$.isExisted = function(source) {
    source = _normalizePath(source);
    return new Promise(function(resolve) {
      return fs.exists(source, function(result) {
        return resolve(result);
      });
    });
  };

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

  $$.rename = co(function*(source, option) {
    source = _formatPath(source);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
        return e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    $.info.isSilent = true;
    yield $$.remove(source);
    $.info.isSilent = false;
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

  $$.write = co(function*(source, data) {
    source = _normalizePath(source);
    $.info.isSilent = true;
    yield $$.mkdir(path.dirname(source));
    $.info.isSilent = false;
    if ($.type(indexOf.call('array object'.split(' '), data) >= 0)) {
      data = $.parseString(data);
    }
    yield new Promise(function(resolve) {
      return fs.writeFile(source, data, function(err) {
        if (err) {
          throw err;
        }
        return resolve();
      });
    });
    $.info('file', "wrote '" + source + "'");
    return $$;
  });


  /*
  
    link(source, target)
    ln(source, target)
   */

  $$.link = co(function*(source, target) {
    var dirname, isDir, type;
    if (!(source && target)) {
      throw _error('length');
    }
    source = _normalizePath(source);
    target = _normalizePath(target);
    if (!(yield $$.isExisted(source))) {
      throw _error("'" + source + "' was invalid");
    }
    isDir = fs.statSync(source).isDirectory();
    type = isDir ? 'dir' : 'file';
    $.info.isSilent = true;
    dirname = path.dirname(target);
    yield $$.mkdir(dirname);
    $.info.isSilent = false;
    yield new Promise(function(resolve) {
      return fs.symlink(source, target, type, function(err) {
        if (err) {
          throw err;
        }
        if (type === 'dir') {
          type = 'directory';
        }
        return resolve();
      });
    });
    $.info('link', "linked '" + type + "' '" + source + "' to '" + target + "'");
    return $$;
  });

  $$.ln = $$.link;


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
  
    mkdir(source)
   */

  $$.mkdir = co(function*(source) {
    var i, len, listPromise, mkdirp, src;
    if (!source) {
      throw _error('length');
    }
    mkdirp = require('mkdirp');
    source = _formatPath(source);
    listPromise = [];
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      listPromise.push((yield new Promise(function(resolve) {
        return mkdirp(src, function(err) {
          if (err) {
            throw err;
          }
          return resolve();
        });
      })));
    }
    yield Promise.all(listPromise);
    $.info('create', "created '" + source + "'");
    return $$;
  });


  /*
  
    remove(source)
    rm(source)
   */

  $$.remove = co(function*(source) {
    source = _formatPath(source);
    yield del(source, {
      force: true
    });
    $.info('remove', "removed '" + source + "'");
    return $$;
  });

  $$.rm = $$.remove;


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
    pathTarget || (pathTarget = path.dirname(pathSource[0]));
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
  
    delay()
    reload(source)
    shell(cmd)
    watch()
   */

  $$.delay = $.delay;

  $$.reload = function(source) {
    source = _formatPath(source);
    livereload.listen();
    $$.watch(source).pipe(livereload());
    return $$;
  };

  $$.shell = $.shell;

  $$.watch = $p.watch;

}).call(this);
