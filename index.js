(function() {
  // require
  /*

  excludeInclude(source)
  formatArgument(arg)
  formatPath(source)
  getRelativePath(source, target)
  makeError(msg)
  normalizePath(source)
  wrapList(list)

  */
  /*

    cloneGitHub(name)

  */
  var $, $$, $p, SSH, _, changed, cleanCss, coffee, coffeelint, colors, composer, download, excludeInclude, fetchGitHub, formatArgument, formatPath, fs, fse, gulp, gulpif, htmlmin, ignore, include, livereload, makeError, markdown, markdownlint, normalizePath, path, plumber, pug, rename, replace, sourcemaps, string, stylint, stylus, uglify, uglifyjs, unzip, using, walk, wrapList, yaml, zip;

  path = require('path');

  fs = require('fs');

  colors = require('colors/safe');

  fse = require('fs-extra');

  $ = require('node-jquery-extend');

  ({_} = $);

  gulp = require('gulp');

  // return
  module.exports = $$ = {};

  $$.library = {$, _, fse, gulp};

  $p = $$.plugin = require('gulp-load-plugins')();

  download = $p.download = require('download');

  walk = $p.walk = require('klaw');

  $p.yargs = require('yargs');

  ({changed, cleanCss, coffee, coffeelint, htmlmin, ignore, include, livereload, markdown, plumber, pug, rename, replace, stylint, stylus, sourcemaps, unzip, using, yaml, zip} = $p);

  gulpif = $p.if;

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

  excludeInclude = function(source) {
    source = formatArgument(source);
    source.push('!**/include/**');
    source = _.uniq(source);
    // return
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
        case 'filename':
          return 'invalid filename';
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
    // check isIgnore
    if (source[0] === '!') {
      isIgnore = true;
      source = source.slice(1);
    }
    // replace \ to /
    source = source.replace(/\\/g, '/');
    // replace . & ~
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
    // replace ../ to ./../ at start
    if (source[0] === '.' && source[1] === '.') {
      source = `${$$.path.base}/${source}`;
    }
    // normalize
    source = path.normalize(source);
    // absolute
    if (!path.isAbsolute(source)) {
      source = `${$$.path.base}${path.sep}${source}`;
    }
    // ignore
    if (isIgnore) {
      source = `!${source}`;
    }
    // return
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
        results.push(`'${key}'`);
      }
      return results;
    })()).join(', ');
  };

  // return
  $$.fn = {excludeInclude, formatArgument, formatPath, makeError, normalizePath, wrapList};

  fetchGitHub = async function(name) {
    var source;
    source = normalizePath(`./../${(name.split('/')[1])}`);
    if ((await $$.isExisted(source))) {
      return (await $$.shell([`cd ${source}`, 'git fetch', 'git pull']));
    }
    return (await $$.shell(`git clone https://github.com/${name}.git ${source}`));
  };

  /*

  task(name, [fn])

  */
  // task
  $$.task = function(...arg) {
    switch (arg.length) {
      case 1:
        return gulp.tasks[arg[0]].fn;
      case 2:
        return gulp.task(...arg);
      default:
        throw makeError('length');
    }
  };

  // added default tasks
  /*

    check()
    default()
    gurumin()
    kokoro()
    noop()
    prune()
    update()

  */
  $$.task('check', async function() {
    var cont, ext, i, j, len, len1, listCont, listExt, listSource, results, source;
    listSource = [];
    listExt = ['coffee', 'md', 'pug', 'styl', 'yaml'];
    for (i = 0, len = listExt.length; i < len; i++) {
      ext = listExt[i];
      listSource.push(`./*.${ext}`);
      listSource.push(`./source/**/*.${ext}`);
      listSource.push(`./test/**/*.${ext}`);
    }
    listSource = (await $$.source(listSource));
    results = [];
    for (j = 0, len1 = listSource.length; j < len1; j++) {
      source = listSource[j];
      cont = $.parseString((await $$.read(source)));
      listCont = cont.split('\n');
      if (!_.trim(_.last(listCont)).length) {
        listCont.pop();
        results.push((await $$.write(source, listCont.join('\n'))));
      } else {
        results.push(void 0);
      }
    }
    return results;
  });

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

  $$.task('gurumin', async function() {
    await fetchGitHub('phonowell/gurumin');
    await $$.remove('./source/gurumin');
    return (await $$.link('./../gurumin/source', './source/gurumin'));
  });

  $$.task('kokoro', async function() {
    var LIST, filename, i, isSame, len, listClean, results, source, target;
    await fetchGitHub('phonowell/kokoro');
    // clean
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    await $$.remove(listClean);
    $.info.resume('kokoro');
    // copy
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md'];
    results = [];
    for (i = 0, len = LIST.length; i < len; i++) {
      filename = LIST[i];
      source = `./../kokoro/${filename}`;
      target = `./${filename}`;
      isSame = (await $$.isSame([source, target]));
      if (isSame === true) {
        continue;
      }
      await $$.copy(source, './');
      results.push((await $$.shell(`git add -f ${$$.path.base}/${filename}`)));
    }
    return results;
  });

  $$.task('noop', function() {
    return null;
  });

  $$.task('prune', async function() {
    var base, line, listDirectory, listExtension, listFile, listSource;
    await $$.shell('npm prune');
    base = './node_modules';
    // file
    listFile = ['.DS_Store', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.flowconfig', '.gitattributes', '.jshintrc', '.npmignore', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENSE', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'circle.yml'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listFile.length; i < len; i++) {
        line = listFile[i];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $$.remove(listSource);
    // directory
    listDirectory = ['.circleci', '.github', '.idea', '.nyc_output', '.vscode', '__tests__', 'assets', 'coverage', 'doc', 'docs', 'example', 'examples', 'images', 'powered-test', 'test', 'tests', 'website'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listDirectory.length; i < len; i++) {
        line = listDirectory[i];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $$.remove(listSource);
    // extension
    listExtension = ['.coffee', '.jst', '.md', '.swp', '.tgz', '.ts'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listExtension.length; i < len; i++) {
        line = listExtension[i];
        results.push(`${base}/**/*${line}`);
      }
      return results;
    })();
    return (await $$.remove(listSource));
  });

  $$.task('update', async function() {
    var registry;
    ({registry} = $$.argv);
    await $$.update({registry});
    return (await $$.shell('npm prune'));
  });

  /*

  backup(source)
  recover(source)

  */
  $$.backup = async function(source) {
    var extname, i, len, src, suffix;
    source = (await $$.source(source));
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      suffix = path.extname(src);
      extname = '.bak';
      $.info.pause('$$.backup');
      await $$.copy(src, null, {suffix, extname});
      $.info.resume('$$.backup');
    }
    $.info('backup', `backed up ${wrapList(source)}`);
    // return
    return $$;
  };

  $$.recover = async function(source) {
    var bak, basename, i, len, src;
    source = formatPath(source);
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      bak = `${src}.bak`;
      if (!(await $$.isExisted(bak))) {
        continue;
      }
      basename = path.basename(src);
      $.info.pause('$$.recover');
      await $$.remove(src);
      await $$.copy(bak, null, basename);
      await $$.remove(bak);
      $.info.resume('$$.recover');
    }
    $.info('recover', `recovered ${wrapList(source)}`);
    // return
    return $$;
  };

  (function() {    /*

    compile(source, [target], [option])

    */
    var fn;
    // function
    fn = async function(...arg) {
      var compiler, extname, method, option, source, target;
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
              throw makeError('type');
            })();
          case 3:
            return arg;
          default:
            throw makeError('length');
        }
      })();
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
        throw makeError(`invalid extname: '.${extname}'`);
      }
      await compiler(source, target, option);
      $.info('compile', `compiled ${wrapList(source)} to ${wrapList(target)}`);
      // return
      return $$;
    };
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
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(markdown(option)).pipe(rename({
          extname: '.html'
        })).pipe(gulpif(option.minify, htmlmin({
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
    // return
    return $$.compile = fn;
  })();

  // https://github.com/kevva/download
  /*

  download(source, target, [option])

  */
  $$.download = async function(...arg) {
    var msg, option, source, target;
    [source, target, option] = (function() {
      switch (arg.length) {
        case 2:
          return [arg[0], arg[1], null];
        case 3:
          return arg;
        default:
          throw makeError('length');
      }
    })();
    target = normalizePath(target);
    if ($.type(option) === 'string') {
      option = {
        filename: option
      };
    }
    await download(source, target, option);
    msg = `downloaded ${wrapList(source)} to ${wrapList(target)}`;
    if (option) {
      msg += `, as '${$.parseString(option)}'`;
    }
    $.info('download', msg);
    return $$; // return
  };

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
  $$.copy = async function(...arg) {
    var msg, option, source, target;
    // source, target, [option]
    [source, target, option] = (function() {
      switch (arg.length) {
        case 2:
          return [arg[0], arg[1], null];
        case 3:
          return arg;
        default:
          throw makeError('length');
      }
    })();
    source = formatPath(source);
    if (target) {
      target = normalizePath(target);
    }
    await new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpif(!!option, rename(option))).pipe(gulp.dest(function(e) {
        return target || e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    msg = `copied ${wrapList(source)} to ${wrapList(target)}`;
    if (option) {
      msg += `, as '${$.parseString(option)}'`;
    }
    $.info('copy', msg);
    return $$; // return
  };

  $$.isExisted = async function(source) {
    var i, len, src;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      if (!(await fse.pathExists(src))) {
        return false;
      }
    }
    return true; // return
  };

  $$.isSame = async function(source) {
    var CONT, SIZE, cont, i, j, len, len1, size, src, stat;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    // check size
    SIZE = null;
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      stat = (await $$.stat(src));
      if (!stat) {
        return false;
      }
      ({size} = stat);
      if (!SIZE) {
        SIZE = size;
        continue;
      }
      if (size !== SIZE) {
        return false;
      }
    }
    // check cont
    CONT = null;
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      $.info.pause('$$.isSame');
      cont = (await $$.read(src));
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
    return true; // return
  };

  $$.link = async function(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = normalizePath(source);
    target = normalizePath(target);
    await fse.ensureSymlink(source, target);
    $.info('link', `linked ${wrapList(source)} to ${wrapList(target)}`);
    return $$; // return
  };

  $$.mkdir = async function(source) {
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
    await Promise.all(listPromise);
    $.info('create', `created ${wrapList(source)}`);
    return $$; // return
  };

  $$.move = async function(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = formatPath(source);
    target = normalizePath(target);
    $.info.pause('$$.move');
    await $$.copy(source, target);
    await $$.remove(source);
    $.info.resume('$$.move');
    $.info('move', `moved ${wrapList(source)} to ${target}`);
    return $$; // return
  };

  $$.read = async function(source, option = {}) {
    var res;
    source = normalizePath(source);
    if (!(await $$.isExisted(source))) {
      $.info('file', `${wrapList(source)} not existed`);
      return null;
    }
    res = (await new Promise(function(resolve) {
      return fs.readFile(source, function(err, data) {
        if (err) {
          throw err;
        }
        return resolve(data);
      });
    }));
    $.info('file', `read ${wrapList(source)}`);
    // return
    if (option.raw) {
      return res;
    }
    return res = (function() {
      switch (path.extname(source).slice(1)) {
        case 'json':
          return $.parseJSON(res);
        case 'html':
        case 'md':
        case 'txt':
        case 'yaml':
        case 'yml':
          return $.parseString(res);
        default:
          return res;
      }
    })();
  };

  $$.remove = async function(source) {
    var i, len, listSource, src;
    listSource = (await $$.source(source));
    for (i = 0, len = listSource.length; i < len; i++) {
      src = listSource[i];
      await new Promise(function(resolve) {
        return fse.remove(src, function(err) {
          if (err) {
            throw err;
          }
          return resolve();
        });
      });
    }
    // $.info 'remove', "removed '#{src}'"
    $.info('remove', `removed ${wrapList(source)}`);
    return $$; // return
  };

  $$.rename = async function(source, option) {
    var i, item, len, listHistory;
    source = formatPath(source);
    listHistory = [];
    await new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
        listHistory.push(e.history);
        return e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    $.info.pause('$$.rename');
    for (i = 0, len = listHistory.length; i < len; i++) {
      item = listHistory[i];
      if ((await $$.isExisted(item[1]))) {
        await $$.remove(item[0]);
      }
    }
    $.info.resume('$$.rename');
    $.info('file', `renamed ${wrapList(source)} as '${$.parseString(option)}'`);
    return $$; // return
  };

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

  $$.stat = async function(source) {
    source = normalizePath(source);
    if (!(await $$.isExisted(source))) {
      $.info('file', `${wrapList(source)} not existed`);
      return null;
    }
    // return
    return new Promise(function(resolve) {
      return fs.stat(source, function(err, stat) {
        if (err) {
          throw err;
        }
        return resolve(stat);
      });
    });
  };

  $$.write = async function(source, data, option) {
    var ref;
    source = normalizePath(source);
    if ((ref = $.type(data)) === 'array' || ref === 'object') {
      data = $.parseString(data);
    }
    await fse.outputFile(source, data, option);
    $.info('file', `wrote ${wrapList(source)}`);
    return $$; // return
  };

  (function() {    /*

    lint(source)

    */
    var fn;
    // function
    fn = async function(source) {
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
      await fn[method](source);
      return $$; // return
    };
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
      return new Promise(async function(resolve) {
        var option;
        option = {
          files: (await $$.source(source))
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
              listMsg.push(colors.gray(`#${item.lineNumber}`));
              if (item.errorContext) {
                listMsg.push(`< ${colors.red(item.errorContext)} >`);
              }
              if (item.ruleDescription) {
                listMsg.push(item.ruleDescription);
              }
              $.i(listMsg.join(' '));
            }
          }
          return resolve();
        });
      });
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
    // return
    return $$.lint = fn;
  })();

  // https://github.com/lazd/gulp-replace
  /*

  replace(pathSource, [pathTarget], target, replacement)

  */
  $$.replace = async function(...arg) {
    var pathSource, pathTarget, replacement, target;
    [pathSource, pathTarget, target, replacement] = (function() {
      switch (arg.length) {
        case 3:
          return [arg[0], null, arg[1], arg[2]];
        case 4:
          return arg;
        default:
          throw makeError('length');
      }
    })();
    pathSource = formatPath(pathSource);
    pathTarget || (pathTarget = path.dirname(pathSource[0]).replace(/\*/g, ''));
    pathTarget = normalizePath(pathTarget);
    await new Promise(function(resolve) {
      return gulp.src(pathSource).pipe(plumber()).pipe(using()).pipe(replace(target, replacement)).pipe(gulp.dest(pathTarget)).on('end', function() {
        return resolve();
      });
    });
    $.info('replace', `replaced '${target}' to '${replacement}', in ${wrapList(pathSource)}, output to ${wrapList(pathTarget)}`);
    // return
    return $$;
  };

  /*

  say(text)

  */
  $$.say = async function(text) {
    var i, len, listMessage, msg;
    if ($$.os !== 'macos') {
      return;
    }
    listMessage = (function() {
      switch ($.type(text)) {
        case 'array':
          return text;
        case 'string':
          return [text];
        default:
          throw makeError('type');
      }
    })();
    for (i = 0, len = listMessage.length; i < len; i++) {
      msg = listMessage[i];
      $.info('say', msg);
      msg = msg.replace(/[#\(\)-]/g, '');
      msg = _.trim(msg);
      if (!msg.length) {
        continue;
      }
      $.info.pause('$$.say');
      await $$.shell(`say ${msg}`);
      $.info.resume('$$.say');
    }
    return text; // return
  };

  // https://github.com/mscdex/ssh2
  SSH = class SSH {
    constructor() {
      this;
    }

    /*

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
    connect(option) {
      return new Promise((resolve) => {
        var Client, conn;
        ({Client} = require('ssh2'));
        conn = new Client();
        conn.on('error', function(err) {
          throw err;
        }).on('ready', function() {
          $.info('ssh', `connected to '${option.username}@${option.host}'`);
          return resolve();
        }).connect(option);
        return this.storage = {conn, option};
      });
    }

    disconnect() {
      return new Promise((resolve) => {
        var conn, option;
        ({conn, option} = this.storage);
        return conn.on('end', function() {
          $.info('ssh', `disconnected from '${option.username}@${option.host}'`);
          return resolve();
        }).end();
      });
    }

    info(chunk) {
      string = $.trim($.parseString(chunk));
      if (!string.length) {
        return;
      }
      string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
      return $.i(string);
    }

    async mkdir(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          results.push(`mkdir -p ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$$.ssh.mkdir');
      await this.shell(cmd);
      $.info.resume('$$.ssh.mkdir');
      return $.info('ssh', `created ${wrapList(source)}`);
    }

    async remove(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
          results.push(`rm -fr ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$$.ssh.remove');
      await this.shell(cmd);
      $.info.resume('$$.ssh.remove');
      return $.info('ssh', `removed ${wrapList(source)}`);
    }

    shell(cmd, option = {}) {
      return new Promise((resolve) => {
        var conn;
        ({conn} = this.storage);
        cmd = formatArgument(cmd);
        cmd = cmd.join(' && ');
        $.info('ssh', colors.blue(cmd));
        return conn.exec(cmd, (err, stream) => {
          if (err) {
            throw err;
          }
          stream.on('end', function() {
            return resolve();
          });
          stream.stderr.on('data', (chunk) => {
            if (option.ignoreError) {
              return this.info(chunk);
            }
            throw $.parseString(chunk);
          });
          return stream.stdout.on('data', (chunk) => {
            return this.info(chunk);
          });
        });
      });
    }

    upload(source, target, option = {}) {
      return new Promise((resolve) => {
        var conn;
        ({conn} = this.storage);
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
        return conn.sftp(async(err, sftp) => {
          var filename, i, len, src, stat;
          if (err) {
            throw err;
          }
          for (i = 0, len = source.length; i < len; i++) {
            src = source[i];
            stat = (await $$.stat(src));
            filename = option.filename || path.basename(src);
            if (stat.isDirectory()) {
              await this.uploadDir(sftp, src, `${target}/${filename}`);
            } else if (stat.isFile()) {
              await this.mkdir(target);
              await this.uploadFile(sftp, src, `${target}/${filename}`);
            }
          }
          sftp.end();
          return resolve();
        });
      });
    }

    uploadDir(sftp, source, target) {
      return new Promise(async(resolve) => {
        var i, len, listSource, relativeTarget, src, stat;
        listSource = [];
        await $$.walk(source, function(item) {
          return listSource.push(item.path);
        });
        for (i = 0, len = listSource.length; i < len; i++) {
          src = listSource[i];
          stat = (await $$.stat(src));
          relativeTarget = path.normalize(`${target}/${path.relative(source, src)}`);
          if (stat.isDirectory()) {
            await this.mkdir(relativeTarget);
          } else if (stat.isFile()) {
            await this.uploadFile(sftp, src, relativeTarget);
          }
        }
        return resolve();
      });
    }

    uploadFile(sftp, source, target) {
      return new Promise(function(resolve) {
        return sftp.fastPut(source, target, function(err) {
          if (err) {
            throw err;
          }
          $.info('ssh', `uploaded '${source}' to '${target}'`);
          return resolve();
        });
      });
    }

  };

  // return
  $$.ssh = new SSH();

  (function() {    /*

      update()

    */
    var addCmd, clean, fn, getLatestVersion;
    // function
    /*

      addCmd(list, data, isDev, option)
      clean()
      getLatestVersion(name, option)

    */
    addCmd = async function(list, data, isDev, option) {
      var cmd, current, latest, name, registry, results, version;
      ({registry} = option);
      results = [];
      for (name in data) {
        version = data[name];
        current = version.replace(/[~^]/, '');
        $.info.pause('$$.update');
        latest = (await getLatestVersion(name, option));
        $.info.resume('$$.update');
        if (current === latest) {
          $.info('update', `'${name}': '${current}' == '${latest}'`);
          continue;
        }
        $.info('update', `'${name}': '${current}' ${colors.green('->')} '${latest}'`);
        cmd = [];
        cmd.push('npm install');
        cmd.push(`${name}@${latest}`);
        if (registry) {
          cmd.push(`--registry ${registry}`);
        }
        cmd.push(isDev ? '--save-dev' : '--save');
        results.push(list.push(cmd.join(' ')));
      }
      return results;
    };
    clean = async function() {
      var listFile;
      await $$.remove('./temp/update');
      listFile = (await $$.source('./temp/**/*.*'));
      if (!listFile.length) {
        return (await $$.remove('./temp'));
      }
    };
    getLatestVersion = async function(name, option) {
      var data, registry, source, url;
      ({registry} = option);
      registry || (registry = 'http://registry.npmjs.org');
      source = `./temp/update/${name}.json`;
      if (!(await $$.isExisted(source))) {
        url = `${registry}/${name}/latest?salt=${_.now()}`;
        await $$.download(url, './temp/update', `${name}.json`);
      }
      if (!(data = (await $$.read(source)))) {
        throw makeError('source');
      }
      // return
      return data.version;
    };
    
    fn = async function(option) {
      var listCmd, pkg;
      pkg = (await $$.read('./package.json'));
      listCmd = [];
      await addCmd(listCmd, pkg.dependencies, false, option);
      await addCmd(listCmd, pkg.devDependencies, true, option);
      $.info.pause('$$.update');
      await clean();
      $.info.resume('$$.update');
      if (!listCmd.length) {
        $.info('update', 'every thing is ok');
        return;
      }
      await $$.shell(listCmd);
      // return
      return $$;
    };
    // return
    return $$.update = fn;
  })();

  // https://github.com/jprichardson/node-klaw
  /*

  walk(source, callback)

  */
  $$.walk = async function(source, callback) {
    if (!(source && callback)) {
      throw makeError('length');
    }
    source = normalizePath(source);
    await new Promise(function(resolve) {
      return walk(source).on('data', function(item) {
        return callback(item);
      }).on('end', function() {
        return resolve();
      });
    });
    return $$; // return
  };

  // https://github.com/sindresorhus/gulp-zip
  // https://github.com/inuscript/gulp-unzip
  /*

  unzip(source, [target])
  zip(source, target, option)

  */
  $$.unzip = async function(source, target) {
    var dist, i, len, src;
    if (!source) {
      throw makeError('source');
    }
    source = (await $$.source(source));
    for (i = 0, len = source.length; i < len; i++) {
      src = source[i];
      dist = target || path.dirname(src);
      await new Promise(function(resolve) {
        return gulp.src(src).pipe(plumber()).pipe(using()).pipe(unzip()).pipe(gulp.dest(dist)).on('end', function() {
          return resolve();
        });
      });
      $.info('zip', `unzipped ${src} to ${dist}`);
    }
    return $$; // return
  };

  $$.zip = async function(...arg) {
    var filename, option, source, target;
    [source, target, option] = (function() {
      switch (arg.length) {
        case 1:
          return [arg[0], null, null];
        case 2:
          return [arg[0], null, arg[1]];
        case 3:
          return arg;
        default:
          throw makeError('length');
      }
    })();
    source = formatPath(source);
    target || (target = path.dirname(source[0]).replace(/\*/g, ''));
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
    filename || (filename = `${path.basename(target)}.zip`);
    await new Promise(function(resolve) {
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(zip(filename)).pipe(gulp.dest(target)).on('end', function() {
        return resolve();
      });
    });
    $.info('zip', `zipped ${wrapList(source)} to ${wrapList(target)}, named as '${filename}'`);
    return $$; // return
  };

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
    return $$; // return
  };

  $$.shell = $.shell;

  $$.watch = $p.watch;

  $$.yargs = $p.yargs;

}).call(this);
