(function() {
  var $, $$, $p, Promise, SSH, _, changed, cleanCss, co, coffee, coffeelint, colors, composer, del, download, excludeInclude, fetchGitHub, formatArgument, formatPath, fs, fse, gulp, gulpif, htmlmin, ignore, include, livereload, makeError, markdown, markdownlint, normalizePath, path, plumber, pug, rename, replace, sourcemaps, string, stylint, stylus, uglify, uglifyjs, unzip, using, walk, wrapList, yaml, zip,
    slice = [].slice;

  path = require('path');

  fs = require('fs');

  colors = require('colors/safe');

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

  walk = $p.walk = require('klaw');

  $p.yargs = require('yargs');

  changed = $p.changed, cleanCss = $p.cleanCss, coffee = $p.coffee, coffeelint = $p.coffeelint, htmlmin = $p.htmlmin, ignore = $p.ignore, include = $p.include, livereload = $p.livereload, markdown = $p.markdown, plumber = $p.plumber, pug = $p.pug, rename = $p.rename, replace = $p.replace, stylint = $p.stylint, stylus = $p.stylus, sourcemaps = $p.sourcemaps, unzip = $p.unzip, using = $p.using, yaml = $p.yaml, zip = $p.zip;

  gulpif = $p["if"];

  uglifyjs = require('uglify-es');

  composer = require('gulp-uglify/composer');

  uglify = $p.uglify = composer(uglifyjs, console);

  markdownlint = $p.markdownlint = require('markdownlint');


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
  
    excludeInclude(source)
    formatArgument(arg)
    formatPath(source)
    getRelativePath(source, target)
    makeError(msg)
    normalizePath(source)
    wrapList(list)
   */

  excludeInclude = function(source) {
    source = formatArgument(source);
    source.push('!**/include/**');
    source = _.uniq(source);
    return source;
  };

  formatArgument = function(arg) {
    switch ($.type(arg)) {
      case 'array':
        return _.clone(arg);
      case 'string':
        return [arg];
      default:
        throw makeError('type');
    }
  };

  formatPath = function(source) {
    var i, len, results, src;
    source = formatArgument(source);
    results = [];
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      results.push(normalizePath(src));
    }
    return results;
  };

  makeError = function(msg) {
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

  normalizePath = function(source) {
    var isIgnore;
    if ($.type(source) !== 'string') {
      return null;
    }
    if (source[0] === '!') {
      isIgnore = true;
      source = source.slice(1);
    }
    source = source.replace(/\\/g, '/');
    source = source.replace(/\.{2}/g, '__parent_directory__');
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
    source = source.replace(/__parent_directory__/g, '..');
    if (source[0] === '.' && source[1] === '.') {
      source = $$.path.base + "/" + source;
    }
    source = path.normalize(source);
    if (!path.isAbsolute(source)) {
      source = "" + $$.path.base + path.sep + source;
    }
    if (isIgnore) {
      source = "!" + source;
    }
    return source;
  };

  wrapList = function(list) {
    var key;
    if (!list) {
      return '';
    }
    list = (function() {
      switch ($.type(list)) {
        case 'array':
          return _.clone(list);
        case 'string':
          return [list];
        default:
          throw makeError('type');
      }
    })();
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = list.length; i < len; i++) {
        key = list[i];
        results.push("'" + key + "'");
      }
      return results;
    })()).join(', ');
  };

  $$.fn = {
    excludeInclude: excludeInclude,
    formatArgument: formatArgument,
    formatPath: formatPath,
    makeError: makeError,
    normalizePath: normalizePath,
    wrapList: wrapList
  };


  /*
  
    cloneGitHub(name)
   */

  fetchGitHub = co(function*(name) {
    var source;
    source = normalizePath("./../" + (name.split('/')[1]));
    if ((yield $$.isExisted(source))) {
      return (yield $$.shell(["cd " + source, 'git fetch', 'git pull']));
    }
    return (yield $$.shell("git clone https://github.com/" + name + ".git " + source));
  });


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
        throw makeError('length');
    }
  };


  /*
  
    check()
    default()
    gurumin()
    kokoro()
    noop()
    prune()
    update()
   */

  $$.task('check', co(function*() {
    var cont, ext, i, j, len, len1, listCont, listExt, listSource, results, source;
    listSource = [];
    listExt = ['coffee', 'md', 'pug', 'styl', 'yaml'];
    for (i = 0, len = listExt.length; i < len; i++) {
      ext = listExt[i];
      listSource.push("./*." + ext);
      listSource.push("./source/**/*." + ext);
    }
    listSource = (yield $$.source(listSource));
    results = [];
    for (j = 0, len1 = listSource.length; j < len1; j++) {
      source = listSource[j];
      cont = $.parseString((yield $$.read(source)));
      listCont = cont.split('\n');
      if (!_.trim(_.last(listCont)).length) {
        listCont.pop();
        results.push((yield $$.write(source, listCont.join('\n'))));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }));

  $$.task('default', function() {
    var key, list;
    list = (function() {
      var results;
      results = [];
      for (key in gulp.tasks) {
        results.push(key);
      }
      return results;
    })();
    list.sort();
    return $.info('task', wrapList(list));
  });

  $$.task('gurumin', co(function*() {
    yield fetchGitHub('phonowell/gurumin');
    yield $$.remove('./source/gurumin');
    return (yield $$.link('./../gurumin/source', './source/gurumin'));
  }));

  $$.task('kokoro', co(function*() {
    var LIST, filename, i, isSame, len, listClean, results, source, target;
    yield fetchGitHub('phonowell/kokoro');
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    yield $$.remove(listClean);
    $.info.resume('kokoro');
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md'];
    results = [];
    for (i = 0, len = LIST.length; i < len; i++) {
      filename = LIST[i];
      source = "./../kokoro/" + filename;
      target = "./" + filename;
      isSame = (yield $$.isSame([source, target]));
      if (isSame === true) {
        continue;
      }
      yield $$.copy(source, './');
      results.push((yield $$.shell("git add -f " + $$.path.base + "/" + filename)));
    }
    return results;
  }));

  $$.task('noop', function() {
    return null;
  });

  $$.task('prune', co(function*() {
    var base, line, listDirectory, listExtension, listFile, listSource;
    yield $$.shell('npm prune');
    base = './node_modules';
    listFile = ['.DS_Store', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.flowconfig', '.gitattributes', '.jshintrc', '.npmignore', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENSE', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'circle.yml'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listFile.length; i < len; i++) {
        line = listFile[i];
        results.push(base + "/**/" + line);
      }
      return results;
    })();
    yield $$.remove(listSource);
    listDirectory = ['.circleci', '.github', '.idea', '.nyc_output', '.vscode', '__tests__', 'assets', 'coverage', 'doc', 'docs', 'example', 'examples', 'images', 'powered-test', 'test', 'tests', 'website'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listDirectory.length; i < len; i++) {
        line = listDirectory[i];
        results.push(base + "/**/" + line);
      }
      return results;
    })();
    yield $$.remove(listSource);
    listExtension = ['.coffee', '.jst', '.md', '.swp', '.tgz', '.ts'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listExtension.length; i < len; i++) {
        line = listExtension[i];
        results.push(base + "/**/*" + line);
      }
      return results;
    })();
    return (yield $$.remove(listSource));
  }));

  $$.task('update', co(function*() {
    yield $$.update();
    return (yield $$.shell('npm prune'));
  }));


  /*
  
    backup(source)
    recover(source)
   */

  $$.backup = co(function*(source) {
    var extname, i, len, src, suffix;
    source = (yield $$.source(source));
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
    $.info('backup', "backed up " + (wrapList(source)));
    return $$;
  });

  $$.recover = co(function*(source) {
    var bak, basename, i, len, src;
    source = formatPath(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      bak = src + ".bak";
      if (!(yield $$.isExisted(bak))) {
        continue;
      }
      basename = path.basename(src);
      $.info.pause('$$.recover');
      yield $$.remove(src);
      yield $$.copy(bak, null, basename);
      yield $$.remove(bak);
      $.info.resume('$$.recover');
    }
    $.info('recover', "recovered " + (wrapList(source)));
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
            return (function() {
              var type;
              type = $.type(arg[1]);
              if (type === 'object') {
                return [arg[0], null, arg[1]];
              }
              if (type === 'string') {
                return [arg[0], arg[1], {}];
              }
              throw makeError('type');
            })();
          case 3:
            return arg;
          default:
            throw makeError('length');
        }
      })(), source = ref[0], target = ref[1], option = ref[2];
      source = formatPath(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw makeError('extname');
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
      target = normalizePath(target);
      option = _.extend({
        map: false,
        minify: true
      }, option);
      compiler = fn[method];
      if (!compiler) {
        throw makeError("invalid extname: '." + extname + "'");
      }
      yield compiler(source, target, option);
      $.info('compile', "compiled " + (wrapList(source)) + " to " + (wrapList(target)));
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
          throw makeError('length');
      }
    })(), source = ref[0], target = ref[1], option = ref[2];
    target = normalizePath(target);
    if ($.type(option) === 'string') {
      option = {
        filename: option
      };
    }
    yield download(source, target, option);
    msg = "downloaded " + (wrapList(source)) + " to " + (wrapList(target));
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
    move(source, target)
    read(source, [option])
    remove(source)
    rename(source, option)
    source(source)
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
          throw makeError('length');
      }
    })(), source = ref[0], target = ref[1], option = ref[2];
    source = formatPath(source);
    if (target) {
      target = normalizePath(target);
    }
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(!!option, rename(option))).pipe(gulp.dest(function(e) {
        return target || e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    msg = "copied " + (wrapList(source)) + " to " + (wrapList(target));
    if (option) {
      msg += ", as '" + ($.parseString(option)) + "'";
    }
    $.info('copy', msg);
    return $$;
  });

  $$.isExisted = co(function*(source) {
    var i, len, src;
    source = formatPath(source);
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
    var CONT, SIZE, cont, i, j, len, len1, size, src, stat;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    SIZE = null;
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      stat = (yield $$.stat(src));
      if (!stat) {
        return false;
      }
      size = stat.size;
      if (!SIZE) {
        SIZE = size;
        continue;
      }
      if (size !== SIZE) {
        return false;
      }
    }
    CONT = null;
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      $.info.pause('$$.isSame');
      cont = (yield $$.read(src));
      $.info.resume('$$.isSame');
      if (!cont) {
        return false;
      }
      cont = $.parseString(cont);
      if (!CONT) {
        CONT = cont;
        continue;
      }
      if (cont !== CONT) {
        return false;
      }
    }
    return true;
  });

  $$.link = co(function*(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = normalizePath(source);
    target = normalizePath(target);
    yield fse.ensureSymlink(source, target);
    $.info('link', "linked " + (wrapList(source)) + " to " + (wrapList(target)));
    return $$;
  });

  $$.mkdir = co(function*(source) {
    var listPromise, src;
    if (!source) {
      throw makeError('length');
    }
    source = formatPath(source);
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
    $.info('create', "created " + (wrapList(source)));
    return $$;
  });

  $$.move = co(function*(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = formatPath(source);
    target = normalizePath(target);
    $.info.pause('$$.move');
    yield $$.copy(source, target);
    yield $$.remove(source);
    $.info.resume('$$.move');
    $.info('move', "moved " + (wrapList(source)) + " to " + target);
    return $$;
  });

  $$.read = co(function*(source, option) {
    var res;
    if (option == null) {
      option = {};
    }
    source = normalizePath(source);
    if (!(yield $$.isExisted(source))) {
      $.info('file', (wrapList(source)) + " not existed");
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
    $.info('file', "read " + (wrapList(source)));
    if (option.raw) {
      return res;
    }
    return res = (function() {
      switch (path.extname(source).slice(1)) {
        case 'json':
          return $.parseJson(res);
        case 'html':
        case 'md':
        case 'txt':
          return $.parseString(res);
        default:
          return res;
      }
    })();
  });

  $$.remove = co(function*(source) {
    source = formatPath(source);
    yield del(source, {
      force: true
    });
    $.info('remove', "removed " + (wrapList(source)));
    return $$;
  });

  $$.rename = co(function*(source, option) {
    source = formatPath(source);
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
    $.info('file', "renamed " + (wrapList(source)) + " as '" + ($.parseString(option)) + "'");
    return $$;
  });

  $$.source = function(source) {
    source = formatPath(source);
    return new Promise(function(resolve) {
      var listSource;
      listSource = [];
      return gulp.src(source, {
        read: false
      }).on('data', function(item) {
        return listSource.push(item.path);
      }).on('end', function() {
        return resolve(listSource);
      });
    });
  };

  $$.stat = co(function*(source) {
    source = normalizePath(source);
    if (!(yield $$.isExisted(source))) {
      $.info('file', (wrapList(source)) + " not existed");
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
    source = normalizePath(source);
    if ((ref = $.type(data)) === 'array' || ref === 'object') {
      data = $.parseString(data);
    }
    yield fse.outputFile(source, data, option);
    $.info('file', "wrote " + (wrapList(source)));
    return $$;
  });


  /*
  
    lint(source)
   */

  (function() {
    var fn;
    fn = co(function*(source) {
      var extname, method;
      source = formatPath(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw makeError('extname');
      }
      method = (function() {
        switch (extname) {
          case 'coffee':
            return 'coffee';
          case 'md':
            return 'markdown';
          case 'styl':
            return 'stylus';
          default:
            throw makeError('extname');
        }
      })();
      yield fn[method](source);
      return $$;
    });

    /*
    
      coffee(source)
      markdown(source)
      stylus(source)
     */
    fn.coffee = function(source) {
      return new Promise(function(resolve) {
        var stream;
        (stream = gulp.src(source)).on('end', function() {
          return resolve();
        });
        return stream.pipe(plumber()).pipe(using()).pipe(coffeelint()).pipe(coffeelint.reporter());
      });
    };
    fn.markdown = function(source) {
      return new Promise(co(function*(resolve) {
        var option;
        option = {
          files: (yield $$.source(source))
        };
        return markdownlint(option, function(err, result) {
          var filename, i, item, len, list, listMsg;
          if (err) {
            throw err;
          }
          for (filename in result) {
            list = result[filename];
            if ($.type(list) !== 'array') {
              continue;
            }
            filename = filename.replace($.info['__reg_base__'], '.').replace($.info['__reg_home__'], '~');
            $.i(colors.magenta(filename));
            for (i = 0, len = list.length; i < len; i++) {
              item = list[i];
              listMsg = [];
              listMsg.push(colors.gray("#" + item.lineNumber));
              if (item.errorContext) {
                listMsg.push("< " + (colors.red(item.errorContext)) + " >");
              }
              if (item.ruleDescription) {
                listMsg.push(item.ruleDescription);
              }
              $.i(listMsg.join(' '));
            }
          }
          return resolve();
        });
      }));
    };
    fn.stylus = function(source) {
      return new Promise(function(resolve) {
        var stream;
        (stream = gulp.src(source)).on('end', function() {
          return resolve();
        });
        return stream.pipe(plumber()).pipe(using()).pipe(stylint()).pipe(stylint.reporter());
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
          throw makeError('length');
      }
    })(), pathSource = ref[0], pathTarget = ref[1], target = ref[2], replacement = ref[3];
    pathSource = formatPath(pathSource);
    pathTarget || (pathTarget = path.dirname(pathSource[0]).replace(/\*/g, ''));
    pathTarget = normalizePath(pathTarget);
    yield new Promise(function(resolve) {
      return gulp.src(pathSource).pipe(plumber()).pipe(using()).pipe(replace(target, replacement)).pipe(gulp.dest(pathTarget)).on('end', function() {
        return resolve();
      });
    });
    $.info('replace', "replaced '" + target + "' to '" + replacement + "', in " + (wrapList(pathSource)) + ", output to " + (wrapList(pathTarget)));
    return $$;
  });

  SSH = (function() {
    function SSH() {
      null;
    }


    /*
    
      storage
    
      connect(option)
      disconnect()
      info(chunk)
      mkdir(source)
      remove(source)
      shell(cmd, [option])
      upload(source, target, [option])
      uploadDir(sftp, source, target)
      uploadFile(sftp, source, target)
     */

    SSH.prototype.connect = function(option) {
      return new Promise((function(_this) {
        return function(resolve) {
          var Client, conn;
          Client = require('ssh2').Client;
          conn = new Client();
          conn.on('error', function(err) {
            throw err;
          }).on('ready', function() {
            $.info('ssh', "connected to '" + option.username + "@" + option.host + "'");
            return resolve();
          }).connect(option);
          return _this.storage = {
            conn: conn,
            option: option
          };
        };
      })(this));
    };

    SSH.prototype.disconnect = function() {
      return new Promise((function(_this) {
        return function(resolve) {
          var conn, option, ref;
          ref = _this.storage, conn = ref.conn, option = ref.option;
          return conn.on('end', function() {
            $.info('ssh', "disconnected from '" + option.username + "@" + option.host + "'");
            return resolve();
          }).end();
        };
      })(this));
    };

    SSH.prototype.info = function(chunk) {
      string = $.trim($.parseString(chunk));
      if (!string.length) {
        return;
      }
      string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
      return $.i(string);
    };

    SSH.prototype.mkdir = co(function*(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          results.push("mkdir -p " + src);
        }
        return results;
      })()).join('; ');
      $.info.pause('$$.ssh.mkdir');
      yield this.shell(cmd);
      $.info.resume('$$.ssh.mkdir');
      return $.info('ssh', "created " + (wrapList(source)));
    });

    SSH.prototype.remove = co(function*(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          results.push("rm -fr " + src);
        }
        return results;
      })()).join('; ');
      $.info.pause('$$.ssh.remove');
      yield this.shell(cmd);
      $.info.resume('$$.ssh.remove');
      return $.info('ssh', "removed " + (wrapList(source)));
    });

    SSH.prototype.shell = function(cmd, option) {
      if (option == null) {
        option = {};
      }
      return new Promise((function(_this) {
        return function(resolve) {
          var conn;
          conn = _this.storage.conn;
          cmd = formatArgument(cmd);
          cmd = cmd.join(' && ');
          $.info('ssh', colors.blue(cmd));
          return conn.exec(cmd, function(err, stream) {
            if (err) {
              throw err;
            }
            stream.on('end', function() {
              return resolve();
            });
            stream.stderr.on('data', function(chunk) {
              if (option.ignoreError) {
                return _this.info(chunk);
              }
              throw $.parseString(chunk);
            });
            return stream.stdout.on('data', function(chunk) {
              return _this.info(chunk);
            });
          });
        };
      })(this));
    };

    SSH.prototype.upload = function(source, target, option) {
      if (option == null) {
        option = {};
      }
      return new Promise((function(_this) {
        return function(resolve) {
          var conn;
          conn = _this.storage.conn;
          source = formatPath(source);
          option = (function() {
            switch ($.type(option)) {
              case 'object':
                return _.clone(option);
              case 'string':
                return {
                  filename: option
                };
              default:
                throw makeError('type');
            }
          })();
          return conn.sftp(co(function*(err, sftp) {
            var filename, i, len, src, stat;
            if (err) {
              throw err;
            }
            for (i = 0, len = source.length; i < len; i++) {
              src = source[i];
              stat = (yield $$.stat(src));
              filename = option.filename || path.basename(src);
              if (stat.isDirectory()) {
                yield _this.uploadDir(sftp, src, target + "/" + filename);
              } else if (stat.isFile()) {
                yield _this.mkdir(target);
                yield _this.uploadFile(sftp, src, target + "/" + filename);
              }
            }
            sftp.end();
            return resolve();
          }));
        };
      })(this));
    };

    SSH.prototype.uploadDir = function(sftp, source, target) {
      return new Promise(co((function(_this) {
        return function*(resolve) {
          var i, len, listSource, relativeTarget, src, stat;
          listSource = [];
          yield $$.walk(source, function(item) {
            return listSource.push(item.path);
          });
          for (i = 0, len = listSource.length; i < len; i++) {
            src = listSource[i];
            stat = (yield $$.stat(src));
            relativeTarget = path.normalize(target + "/" + (path.relative(source, src)));
            if (stat.isDirectory()) {
              yield _this.mkdir(relativeTarget);
            } else if (stat.isFile()) {
              yield _this.uploadFile(sftp, src, relativeTarget);
            }
          }
          return resolve();
        };
      })(this)));
    };

    SSH.prototype.uploadFile = function(sftp, source, target) {
      return new Promise(function(resolve) {
        return sftp.fastPut(source, target, function(err) {
          if (err) {
            throw err;
          }
          $.info('ssh', "uploaded '" + source + "' to '" + target + "'");
          return resolve();
        });
      });
    };

    return SSH;

  })();

  $$.ssh = new SSH();


  /*
  
    update()
   */

  (function() {
    var REGISTRY, addCmdLines, clean, fn, getLatestVersion;
    REGISTRY = 'https://registry.npm.taobao.org';

    /*
    
      addCmdLines(list, type, data)
      clean()
      getLatestVersion(name)
     */
    addCmdLines = co(function*(list, data, isDev) {
      var cmd, current, latest, name, results, version;
      results = [];
      for (name in data) {
        version = data[name];
        current = version.replace(/[~^]/, '');
        if (!(latest = (yield getLatestVersion(name)))) {
          continue;
        }
        if (current === latest) {
          continue;
        }
        cmd = ['npm install'];
        cmd.push(name + "@" + latest);
        cmd.push("--registry " + REGISTRY);
        cmd.push(isDev ? '--save-dev' : '--save');
        results.push(list.push(cmd.join(' ')));
      }
      return results;
    });
    clean = co(function*() {
      var listFile;
      yield $$.remove('./temp/update');
      listFile = (yield $$.source('./temp/**/*.*'));
      if (!listFile.length) {
        return (yield $$.remove('./temp'));
      }
    });
    getLatestVersion = co(function*(name) {
      var data, source, url;
      source = "./temp/update/" + name + ".json";
      if (!(yield $$.isExisted(source))) {
        url = REGISTRY + "/" + name + "/latest";
        try {
          yield $$.download(url, './temp/update', name + ".json");
        } catch (error) {}
      }
      data = (yield $$.read(source));
      if (!data) {
        return null;
      }
      return data.version;
    });
    fn = co(function*() {
      var listCmd, pkg;
      pkg = (yield $$.read('./package.json'));
      listCmd = [];
      $.info.pause('$$.update');
      yield addCmdLines(listCmd, pkg.dependencies);
      yield addCmdLines(listCmd, pkg.devDependencies, true);
      yield clean();
      $.info.resume('$$.update');
      if (!listCmd.length) {
        $.info('update', 'every thing is ok');
        return;
      }
      yield $$.shell(listCmd);
      return $$;
    });
    return $$.update = fn;
  })();


  /*
  
    walk(source, callback)
   */

  $$.walk = co(function*(source, callback) {
    if (!(source && callback)) {
      throw makeError('length');
    }
    source = normalizePath(source);
    yield new Promise(function(resolve) {
      return walk(source).on('data', function(item) {
        return callback(item);
      }).on('end', function() {
        return resolve();
      });
    });
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
          throw makeError('length');
      }
    })(), source = ref[0], target = ref[1];
    source = formatPath(source);
    target || (target = (path.dirname(source[0])) + "/" + (path.basename(source[0], '.zip')));
    target = normalizePath(target);
    yield new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(unzip()).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    $.info('zip', "unzipped " + (wrapList(source)) + " to " + (wrapList(target)));
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
          throw makeError('length');
      }
    })(), source = ref[0], target = ref[1], option = ref[2];
    source = formatPath(source);
    target || (target = path.dirname(source[0]));
    target = normalizePath(target);
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
    $.info('zip', "zipped " + (wrapList(source)) + " to " + (wrapList(target)) + ", named as '" + filename + "'");
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
      throw makeError('source');
    }
    source = formatPath(source);
    livereload.listen();
    $$.watch(source).pipe(livereload());
    return $$;
  };

  $$.shell = $.shell;

  $$.watch = $p.watch;

  $$.yargs = $p.yargs;

}).call(this);
