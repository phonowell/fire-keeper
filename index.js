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
  fetchGitHub_(name)
  */
  var $, $p, SSH, Shell, _, chalk, excludeInclude, fetchGitHub_, formatArgument, formatPath, fs, fse, gulp, gulpIf, i, j, k, key, len, len1, len2, listKey, makeError, name, normalizePath, path, ref, string, uglify, walk, wrapList;

  path = require('path');

  fs = require('fs');

  chalk = require('chalk');

  fse = require('fs-extra');

  $ = require('node-jquery-extend');

  ({_} = $);

  gulp = require('gulp');

  // return
  module.exports = $;

  $.library = {_, fse, gulp};

  $p = {};

  ref = ['archiver', 'download', 'gulp-changed', 'gulp-clean-css', 'gulp-coffee', 'gulp-coffeelint', 'gulp-htmlmin', 'gulp-ignore', 'gulp-include', 'gulp-livereload', 'gulp-markdown', 'gulp-plumber', 'gulp-pug', 'gulp-rename', 'gulp-sourcemaps', 'gulp-stylint', 'gulp-stylus', 'gulp-unzip', 'gulp-using', 'gulp-watch', 'gulp-yaml', 'markdownlint', 'yargs'];
  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];
    name = _.camelCase(key.replace(/gulp-/, ''));
    global[name] = $p[name] = require(key);
  }

  walk = $p.walk = require('klaw');

  gulpIf = $p.if = require('gulp-if');

  uglify = $p.uglify = (function() {
    var composer, uglifyEs;
    uglifyEs = require('uglify-es');
    composer = require('gulp-uglify/composer');
    return composer(uglifyEs, console);
  })();

  // return
  $.plugin = $p;

  /*
  argv
  os
  path
  */
  $.argv = $p.yargs.argv;

  $.os = (function() {
    switch (false) {
      case !~(string = process.platform).search('darwin'):
        return 'macos';
      case !~string.search('win'):
        return 'windows';
      default:
        return 'linux';
    }
  })();

  $.path = {
    base: process.cwd(),
    home: require('os').homedir()
  };

  excludeInclude = function(source) {
    source = formatArgument(source);
    source.push('!**/include/**');
    source = _.uniq(source);
    return source; // return
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
    var j, len1, results, src;
    source = formatArgument(source);
    results = [];
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
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
          return source.replace(/\./, $.path.base);
        case '~':
          return source.replace(/~/, $.path.home);
        default:
          return source;
      }
    })();
    source = source.replace(/__parent_directory__/g, '..');
    // replace ../ to ./../ at start
    if (source[0] === '.' && source[1] === '.') {
      source = `${$.path.base}/${source}`;
    }
    // normalize
    source = path.normalize(source);
    // absolute
    if (!path.isAbsolute(source)) {
      source = `${$.path.base}${path.sep}${source}`;
    }
    // ignore
    if (isIgnore) {
      source = `!${source}`;
    }
    return source; // return
  };

  wrapList = function(list) {
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
      var j, len1, results;
      results = [];
      for (j = 0, len1 = list.length; j < len1; j++) {
        key = list[j];
        results.push(`'${key}'`);
      }
      return results;
    })()).join(', ');
  };

  // return
  $.fn = {excludeInclude, formatArgument, formatPath, makeError, normalizePath, wrapList};

  fetchGitHub_ = async function(name) {
    var source;
    source = normalizePath(`./../${(name.split('/')[1])}`);
    if ((await $.isExisted_(source))) {
      return (await $.shell_([`cd ${source}`, 'git fetch', 'git pull']));
    }
    return (await $.shell_(`git clone https://github.com/${name}.git ${source}`));
  };

  /*
  task(name, [fn])
  */
  // task
  $.task = function(...arg) {
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
  $.task('check', async function() {
    var cont, ext, j, k, len1, len2, listCont, listExt, listSource, results, source;
    listSource = [];
    listExt = ['coffee', 'md', 'pug', 'styl', 'yaml'];
    for (j = 0, len1 = listExt.length; j < len1; j++) {
      ext = listExt[j];
      listSource.push(`./*.${ext}`);
      listSource.push(`./source/**/*.${ext}`);
      listSource.push(`./test/**/*.${ext}`);
    }
    listSource = (await $.source_(listSource));
    results = [];
    for (k = 0, len2 = listSource.length; k < len2; k++) {
      source = listSource[k];
      cont = $.parseString((await $.read_(source)));
      listCont = cont.split('\n');
      if (!_.trim(_.last(listCont)).length) {
        listCont.pop();
        results.push((await $.write_(source, listCont.join('\n'))));
      } else {
        results.push(void 0);
      }
    }
    return results;
  });

  $.task('default', function() {
    var list;
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

  $.task('gurumin', async function() {
    await fetchGitHub_('phonowell/gurumin');
    await $.remove_('./source/gurumin');
    return (await $.link_('./../gurumin/source', './source/gurumin'));
  });

  $.task('kokoro', async function() {
    var LIST, filename, isSame, j, len1, listClean, results, source, target;
    await fetchGitHub_('phonowell/kokoro');
    // clean
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    await $.remove_(listClean);
    $.info.resume('kokoro');
    // copy
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md'];
    results = [];
    for (j = 0, len1 = LIST.length; j < len1; j++) {
      filename = LIST[j];
      source = `./../kokoro/${filename}`;
      target = `./${filename}`;
      isSame = (await $.isSame_([source, target]));
      if (isSame === true) {
        continue;
      }
      await $.copy_(source, './');
      results.push((await $.shell_(`git add -f ${$.path.base}/${filename}`)));
    }
    return results;
  });

  $.task('noop', function() {
    return null;
  });

  $.task('prune', async function() {
    var base, line, listDirectory, listExtension, listFile, listSource;
    await $.shell_('npm prune');
    base = './node_modules';
    // file
    listFile = ['.DS_Store', '.appveyor.yml', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.flowconfig', '.gitattributes', '.gitlab-ci.yml', '.htmllintrc', '.jshintrc', '.lint', '.npmignore', '.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', '.stylelintrc.yaml', '.stylelintrc.yml', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENSE', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'circle.yml', 'eslint', 'gulpfile.js', 'htmllint.js', 'jest.config.js', 'karma.conf.js', 'license', 'stylelint.config.js', 'tsconfig.json'];
    listSource = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = listFile.length; j < len1; j++) {
        line = listFile[j];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $.remove_(listSource);
    // directory
    listDirectory = ['.circleci', '.github', '.idea', '.nyc_output', '.vscode', '__tests__', 'assets', 'coverage', 'doc', 'docs', 'example', 'examples', 'images', 'powered-test', 'test', 'tests', 'website'];
    listSource = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = listDirectory.length; j < len1; j++) {
        line = listDirectory[j];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $.remove_(listSource);
    // extension
    listExtension = ['.coffee', '.jst', '.markdown', '.md', '.swp', '.tgz', '.ts'];
    listSource = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = listExtension.length; j < len1; j++) {
        line = listExtension[j];
        results.push(`${base}/**/*${line}`);
      }
      return results;
    })();
    return (await $.remove_(listSource));
  });

  $.task('update', async function() {
    var registry;
    ({registry} = $.argv);
    await $.update_({registry});
    return (await $.shell_('npm prune'));
  });

  /*
  backup_(source)
  recover_(source)
  */
  $.backup_ = async function(source) {
    var extname, j, len1, src, suffix;
    source = (await $.source_(source));
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      suffix = path.extname(src);
      extname = '.bak';
      $.info.pause('$.backup_');
      await $.copy_(src, null, {suffix, extname});
      $.info.resume('$.backup_');
    }
    $.info('backup', `backed up ${wrapList(source)}`);
    return $; // return
  };

  $.recover_ = async function(source) {
    var bak, basename, j, len1, src;
    source = formatPath(source);
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      bak = `${src}.bak`;
      if (!(await $.isExisted_(bak))) {
        continue;
      }
      basename = path.basename(src);
      $.info.pause('$.recover_');
      await $.remove_(src);
      await $.copy_(bak, null, basename);
      await $.remove_(bak);
      $.info.resume('$.recover_');
    }
    $.info('recover', `recovered ${wrapList(source)}`);
    return $; // return
  };

  /*
  chain(fn, option)
  */
  $.chain = require('achain');

  (function() {    /*
    compile_(source, [target], [option])
    */
    var fn_;
    // function
    fn_ = async function(...arg) {
      var compile_, extname, method, option, source, target;
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
      compile_ = fn_[`${method}_`];
      if (!compile_) {
        throw makeError(`invalid extname: '.${extname}'`);
      }
      await compile_(source, target, option);
      $.info('compile', `compiled ${wrapList(source)} to ${wrapList(target)}`);
      return $; // return
    };
    /*
    coffee_(source, target, option)
    css_(source, target, option)
    js_(source, target, option)
    markdown_(source, target, option)
    pug_(source, target, option)
    stylus_(source, target, option)
    yaml_(source, target, option)
    */
    fn_.coffee_ = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.harmony == null) {
          option.harmony = true;
        }
        if (!option.harmony) {
          option.transpile = {
            presets: ['env']
          };
        }
        delete option.harmony;
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpIf(option.map, sourcemaps.init())).pipe(include()).pipe(coffee(option)).pipe(gulpIf(option.minify, uglify())).pipe(gulpIf(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.css_ = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpIf(option.map, sourcemaps.init())).pipe(gulpIf(option.minify, cleanCss())).pipe(gulpIf(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.js_ = function(source, target, option) {
      return new Promise(function(resolve) {
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpIf(option.map, sourcemaps.init())).pipe(gulpIf(option.minify, uglify())).pipe(gulpIf(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.markdown_ = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.sanitize == null) {
          option.sanitize = true;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(markdown(option)).pipe(rename({
          extname: '.html'
        })).pipe(gulpIf(option.minify, htmlmin({
          collapseWhitespace: true
        }))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.pug_ = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.pretty == null) {
          option.pretty = !option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.stylus_ = function(source, target, option) {
      return new Promise(function(resolve) {
        if (option.compress == null) {
          option.compress = option.minify;
        }
        return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpIf(option.map, sourcemaps.init())).pipe(stylus(option)).pipe(gulpIf(option.map, sourcemaps.write(''))).pipe(gulp.dest(target)).on('end', function() {
          return resolve();
        });
      });
    };
    fn_.yaml_ = function(source, target, option) {
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
    return $.compile_ = fn_;
  })();

  // https://github.com/kevva/download
  /*
  download_(source, target, [option])
  */
  $.download_ = async function(...arg) {
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
    // this function download was from plugin
    await download(source, target, option);
    msg = `downloaded ${wrapList(source)} to ${wrapList(target)}`;
    if (option) {
      msg += `, as '${$.parseString(option)}'`;
    }
    $.info('download', msg);
    return $; // return
  };

  /*
  copy_(source, target, [option])
  isExisted_(source)
  isSame_(source, target)
  link_(source, target)
  mkdir_(source)
  move_(source, target)
  read_(source, [option])
  remove_(source)
  rename_(source, option)
  source_(source)
  stat_(source)
  write_(source, data)
  */
  $.copy_ = async function(...arg) {
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
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(gulpIf(!!option, rename(option))).pipe(gulp.dest(function(e) {
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
    return $; // return
  };

  $.isExisted_ = async function(source) {
    var j, len1, src;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      if (!(await fse.pathExists(src))) {
        return false;
      }
    }
    return true; // return
  };

  $.isSame_ = async function(source) {
    var CONT, SIZE, cont, j, k, len1, len2, size, src, stat;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    // check size
    SIZE = null;
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      stat = (await $.stat_(src));
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
    for (k = 0, len2 = source.length; k < len2; k++) {
      src = source[k];
      $.info.pause('$.isSame_');
      cont = (await $.read_(src));
      $.info.resume('$.isSame_');
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

  $.link_ = async function(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = normalizePath(source);
    target = normalizePath(target);
    await fse.ensureSymlink(source, target);
    $.info('link', `linked ${wrapList(source)} to ${wrapList(target)}`);
    return $; // return
  };

  $.mkdir_ = async function(source) {
    var listPromise, src;
    if (!source) {
      throw makeError('length');
    }
    source = formatPath(source);
    listPromise = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = source.length; j < len1; j++) {
        src = source[j];
        results.push(fse.ensureDir(src));
      }
      return results;
    })();
    await Promise.all(listPromise);
    $.info('create', `created ${wrapList(source)}`);
    return $; // return
  };

  $.move_ = async function(source, target) {
    if (!(source && target)) {
      throw makeError('length');
    }
    source = formatPath(source);
    target = normalizePath(target);
    $.info.pause('$.move_');
    await $.copy_(source, target);
    await $.remove_(source);
    $.info.resume('$.move_');
    $.info('move', `moved ${wrapList(source)} to '${target}'`);
    return $; // return
  };

  $.read_ = async function(source, option = {}) {
    var res;
    source = normalizePath(source);
    if (!(await $.isExisted_(source))) {
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
        case 'coffee':
        case 'css':
        case 'html':
        case 'js':
        case 'md':
        case 'pug':
        case 'sh':
        case 'styl':
        case 'txt':
        case 'xml':
        case 'yaml':
        case 'yml':
          return $.parseString(res);
        default:
          return res;
      }
    })();
  };

  $.remove_ = async function(source) {
    var j, len1, listSource, src;
    listSource = (await $.source_(source));
    for (j = 0, len1 = listSource.length; j < len1; j++) {
      src = listSource[j];
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
    return $; // return
  };

  $.rename_ = async function(source, option) {
    var item, j, len1, listHistory;
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
    $.info.pause('$.rename_');
    for (j = 0, len1 = listHistory.length; j < len1; j++) {
      item = listHistory[j];
      if ((await $.isExisted_(item[1]))) {
        await $.remove_(item[0]);
      }
    }
    $.info.resume('$.rename_');
    $.info('file', `renamed ${wrapList(source)} as '${$.parseString(option)}'`);
    return $; // return
  };

  $.source_ = async function(source) {
    source = formatPath(source);
    return (await new Promise(function(resolve) {
      var listSource;
      listSource = [];
      return gulp.src(source, {
        read: false
      }).on('data', function(item) {
        return listSource.push(item.path);
      }).on('end', function() {
        return resolve(listSource);
      });
    }));
  };

  $.stat_ = async function(source) {
    source = normalizePath(source);
    if (!(await $.isExisted_(source))) {
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

  $.write_ = async function(source, data, option) {
    var ref1;
    source = normalizePath(source);
    if ((ref1 = $.type(data)) === 'array' || ref1 === 'object') {
      data = $.parseString(data);
    }
    await fse.outputFile(source, data, option);
    $.info('file', `wrote ${wrapList(source)}`);
    return $; // return
  };

  (function() {    /*
    lint_(source)
    */
    var fn_;
    // function
    fn_ = async function(source) {
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
      await fn_[`${method}_`](source);
      return $; // return
    };
    /*
    coffee_(source)
    markdown_(source)
    stylus_(source)
    */
    fn_.coffee_ = function(source) {
      return new Promise(function(resolve) {
        var stream;
        (stream = gulp.src(source)).on('end', function() {
          return resolve();
        });
        return stream.pipe(plumber()).pipe(using()).pipe(coffeelint()).pipe(coffeelint.reporter());
      });
    };
    fn_.markdown_ = function(source) {
      return new Promise(async function(resolve) {
        var option;
        option = {
          files: (await $.source_(source))
        };
        return markdownlint(option, function(err, result) {
          var filename, item, j, len1, list, listMsg;
          if (err) {
            throw err;
          }
          for (filename in result) {
            list = result[filename];
            if ($.type(list) !== 'array') {
              continue;
            }
            filename = filename.replace($.info['__reg_base__'], '.').replace($.info['__reg_home__'], '~');
            $.i(chalk.magenta(filename));
            for (j = 0, len1 = list.length; j < len1; j++) {
              item = list[j];
              listMsg = [];
              listMsg.push(chalk.gray(`#${item.lineNumber}`));
              if (item.errorContext) {
                listMsg.push(`< ${chalk.red(item.errorContext)} >`);
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
    fn_.stylus_ = function(source) {
      return new Promise(function(resolve) {
        var stream;
        (stream = gulp.src(source)).on('end', function() {
          return resolve();
        });
        return stream.pipe(plumber()).pipe(using()).pipe(stylint()).pipe(stylint.reporter());
      });
    };
    // return
    return $.lint_ = fn_;
  })();

  /*
  replace_(source, option...)
  */
  $.replace_ = async function(source, ...option) {
    var callback, cont, j, len1, listSource, msg, reg, replacement, res, src;
    if (!source) {
      throw makeError('source');
    }
    listSource = (await $.source_(source));
    switch (option.length) {
      case 1:
        callback = option[0];
        break;
      case 2:
        [reg, replacement] = option;
        break;
      default:
        throw makeError('length');
    }
    msg = callback ? 'replaced with function' : `replaced '${reg}' to '${replacement}'`;
    for (j = 0, len1 = listSource.length; j < len1; j++) {
      src = listSource[j];
      $.info.pause('$.replace_');
      cont = $.parseString((await $.read_(src)));
      res = callback ? $.parseString(callback(cont)) : cont.replace(reg, replacement);
      if (res === cont) {
        continue;
      }
      await $.write_(src, res);
      $.info.resume('$.replace_');
      $.info('replace', `${msg}, in '${src}'`);
    }
    return $; // return
  };

  /*
  say_(text)
  */
  $.say_ = async function(text) {
    var j, len1, listMessage, msg;
    if ($.os !== 'macos') {
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
    for (j = 0, len1 = listMessage.length; j < len1; j++) {
      msg = listMessage[j];
      $.info('say', msg);
      msg = msg.replace(/[#\(\)-]/g, '');
      msg = _.trim(msg);
      if (!msg.length) {
        continue;
      }
      $.info.pause('$.say_');
      await $.shell_(`say ${msg}`);
      $.info.resume('$.say_');
    }
    return text; // return
  };

  Shell = (function() {
    class Shell {
      /*
      close()
      execute_(cmd, [option])
      info([type], string)
      */
      close() {
        this.process.kill();
        return this;
      }

      execute_(cmd, option = {}) {
        return new Promise((resolve) => {
          var arg, cmder, isIgnoreError, type;
          type = $.type(cmd);
          cmd = (function() {
            switch (type) {
              case 'array':
                return cmd.join(' && ');
              case 'string':
                return cmd;
              default:
                throw new Error(`invalid argument type <${type}>`);
            }
          })();
          $.info('shell', cmd);
          isIgnoreError = !!option.ignoreError;
          delete option.ignoreError;
          [cmder, arg] = $.os === 'windows' ? ['cmd.exe', ['/s', '/c', `"${cmd}"`]] : ['/bin/sh', ['-c', cmd]];
          this.process = this.spawn(cmder, arg, option);
          // bind
          this.process.stderr.on('data', (data) => {
            return this.info('error', data);
          });
          this.process.stdout.on('data', (data) => {
            return this.info(data);
          });
          return this.process.on('close', function(code) {
            if (code === 0 || isIgnoreError) {
              return resolve(true);
            }
            return resolve(false);
          });
        });
      }

      info(...arg) {
        var type;
        [type, string] = (function() {
          switch (arg.length) {
            case 1:
              return [null, arg[0]];
            case 2:
              return arg;
            default:
              throw makeError('length');
          }
        })();
        string = $.trim(string);
        if (!string.length) {
          return;
        }
        string = string.replace(/\r/g, '\n').replace(/\n{2,}/g, '');
        string = (function() {
          switch (type) {
            case 'error':
              return chalk.red(string);
            default:
              return chalk.gray(string);
          }
        })();
        return $.log(string);
      }

    };

    /*
    spawn
    */
    Shell.prototype.spawn = require('child_process').spawn;

    return Shell;

  }).call(this);

  // return
  $.shell_ = async function(cmd, option) {
    var shell;
    shell = new Shell();
    if (!cmd) {
      return shell;
    }
    return (await shell.execute_(cmd, option));
  };

  // https://github.com/mscdex/ssh2
  SSH = class SSH {
    /*
    connect_(option)
    disconnect_()
    info(chunk)
    mkdir_(source)
    remove_(source)
    shell_(cmd, [option])
    upload_(source, target, [option])
    uploadDir_(sftp, source, target)
    uploadFile_(sftp, source, target)
    */
    connect_(option) {
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

    disconnect_() {
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

    async mkdir_(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = source.length; j < len1; j++) {
          src = source[j];
          results.push(`mkdir -p ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$.ssh.mkdir_');
      await this.shell_(cmd);
      $.info.resume('$.ssh.mkdir_');
      return $.info('ssh', `created ${wrapList(source)}`);
    }

    async remove_(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = source.length; j < len1; j++) {
          src = source[j];
          results.push(`rm -fr ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$.ssh.remove_');
      await this.shell_(cmd);
      $.info.resume('$.ssh.remove_');
      return $.info('ssh', `removed ${wrapList(source)}`);
    }

    shell_(cmd, option = {}) {
      return new Promise((resolve) => {
        var conn;
        ({conn} = this.storage);
        cmd = formatArgument(cmd);
        cmd = cmd.join(' && ');
        $.info('ssh', chalk.blue(cmd));
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

    upload_(source, target, option = {}) {
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
          var filename, j, len1, src, stat;
          if (err) {
            throw err;
          }
          for (j = 0, len1 = source.length; j < len1; j++) {
            src = source[j];
            stat = (await $.stat_(src));
            filename = option.filename || path.basename(src);
            if (stat.isDirectory()) {
              await this.uploadDir_(sftp, src, `${target}/${filename}`);
            } else if (stat.isFile()) {
              await this.mkdir_(target);
              await this.uploadFile_(sftp, src, `${target}/${filename}`);
            }
          }
          sftp.end();
          return resolve();
        });
      });
    }

    uploadDir_(sftp, source, target) {
      return new Promise(async(resolve) => {
        var j, len1, listSource, relativeTarget, src, stat;
        listSource = [];
        await $.walk_(source, function(item) {
          return listSource.push(item.path);
        });
        for (j = 0, len1 = listSource.length; j < len1; j++) {
          src = listSource[j];
          stat = (await $.stat_(src));
          relativeTarget = path.normalize(`${target}/${path.relative(source, src)}`);
          if (stat.isDirectory()) {
            await this.mkdir_(relativeTarget);
          } else if (stat.isFile()) {
            await this.uploadFile_(sftp, src, relativeTarget);
          }
        }
        return resolve();
      });
    }

    uploadFile_(sftp, source, target) {
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
  $.ssh = new SSH();

  (function() {
    var addCmd_, clean_, execute_, getLatestVersion_;
    // function
    /*
    addCmd_(list, data, isDev, option)
    clean_()
    execute_(option)
    getLatestVersion_(name, option)
    */
    addCmd_ = async function(list, data, isDev, option) {
      var current, latest, registry, results, version;
      ({registry} = option);
      results = [];
      for (name in data) {
        version = data[name];
        current = version.replace(/[~^]/, '');
        $.info.pause('$.update_');
        latest = (await getLatestVersion_(name, option));
        $.info.resume('$.update_');
        if (current === latest) {
          $.info('update', `'${name}': '${current}' == '${latest}'`);
          continue;
        }
        $.info('update', `'${name}': '${current}' ${chalk.green('->')} '${latest}'`);
        results.push(list.push(['npm install', `${name}@${latest}`, isDev ? '' : '--production', registry ? `--registry ${registry}` : '', isDev ? '--save-dev' : '--save'].join(' ').replace(/\s{2,}/g, ' ')));
      }
      return results;
    };
    clean_ = async function() {
      var listFile;
      await $.remove_('./temp/update');
      listFile = (await $.source_('./temp/**/*.*'));
      if (!listFile.length) {
        return (await $.remove_('./temp'));
      }
    };
    execute_ = async function(option) {
      var listCmd, pkg;
      pkg = (await $.read_('./package.json'));
      listCmd = [];
      await addCmd_(listCmd, pkg.dependencies, false, option);
      await addCmd_(listCmd, pkg.devDependencies, true, option);
      $.info.pause('$.update_');
      await clean_();
      $.info.resume('$.update_');
      if (!listCmd.length) {
        $.info('update', 'every thing is ok');
        return;
      }
      await $.shell_(listCmd);
      return $; // return
    };
    getLatestVersion_ = async function(name, option) {
      var data, registry, source, url;
      ({registry} = option);
      registry || (registry = 'http://registry.npmjs.org');
      source = `./temp/update/${name}.json`;
      if (!(await $.isExisted_(source))) {
        url = `${registry}/${name}?salt=${_.now()}`;
        await $.download_(url, './temp/update', `${name}.json`);
      }
      if (!(data = (await $.read_(source)))) {
        throw makeError('source');
      }
      // return
      return _.get(data, 'dist-tags.latest');
    };
    // return
    return $.update_ = async function(...arg) {
      return (await execute_(...arg));
    };
  })();

  // https://github.com/jprichardson/node-klaw
  /*
  walk_(source, callback)
  */
  $.walk_ = async function(source, callback) {
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
    return $; // return
  };

  /*
  unzip_(source, [target])
  zip_(source, [target], [option])
  */
  $.unzip_ = async function(source, target) {
    var dist, j, len1, src;
    if (!source) {
      throw makeError('source');
    }
    source = (await $.source_(source));
    for (j = 0, len1 = source.length; j < len1; j++) {
      src = source[j];
      dist = target || path.dirname(src);
      await new Promise(function(resolve) {
        return gulp.src(src).pipe(plumber()).pipe(using()).pipe(unzip()).pipe(gulp.dest(dist)).on('end', function() {
          return resolve();
        });
      });
      $.info('zip', `unzipped ${src} to ${dist}`);
    }
    return $; // return
  };

  $.zip_ = async function(...arg) {
    var _source, base, filename, isSilent, option, source, target;
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
    _source = source;
    source = formatPath(source);
    target || (target = path.dirname(source[0]).replace(/\*/g, ''));
    target = normalizePath(target);
    [base, filename, isSilent] = (function() {
      switch ($.type(option)) {
        case 'object':
          return [option.base, option.filename, option.silent || option.isSilent];
        case 'string':
          return [null, option, false];
        default:
          return [null, null, false];
      }
    })();
    base || (base = (function() {
      _source = (function() {
        switch ($.type(_source)) {
          case 'array':
            return _source[0];
          case 'string':
            return _source;
          default:
            throw makeError('type');
        }
      })();
      if (~_source.search(/\*/)) {
        return _.trim(_source.replace(/\*.*/, ''), '/');
      }
      return path.dirname(_source);
    })());
    base = normalizePath(base);
    filename || (filename = `${path.basename(target)}.zip`);
    filename = `${target}/${filename}`;
    await new Promise(async function(resolve) {
      var archive, j, len1, listSource, msg, output, src;
      output = fs.createWriteStream(filename);
      archive = archiver('zip', {
        zlib: {
          level: 9
        }
      });
      archive.on('warning', function(err) {
        throw err;
      });
      archive.on('error', function(err) {
        throw err;
      });
      msg = null;
      archive.on('entry', function(e) {
        if (isSilent) {
          return;
        }
        return msg = $.info.renderPath(e.sourcePath);
      });
      archive.on('progress', function(e) {
        var gray, magenta;
        if (isSilent) {
          return;
        }
        if (!msg) {
          return;
        }
        gray = chalk.gray(`${Math.floor(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`);
        magenta = chalk.magenta(msg);
        msg = `${gray} ${magenta}`;
        $.i(msg);
        return msg = null;
      });
      archive.on('end', function() {
        return resolve();
      });
      archive.pipe(output);
      listSource = (await $.source_(source));
      for (j = 0, len1 = listSource.length; j < len1; j++) {
        src = listSource[j];
        name = src.replace(base, '');
        archive.file(src, {name});
      }
      return archive.finalize();
    });
    $.info('zip', `zipped ${wrapList(source)} to ${wrapList(target)}, named as '${filename}'`);
    return $; // return
  };

  /*
  delay_([time], [callback])
  reload(source)
  watch(source)
  yargs()
  */
  $.delay_ = async function(time = 0, callback) {
    await new Promise(function(resolve) {
      return setTimeout(function() {
        return resolve();
      }, time);
    });
    $.info('delay', `delayed '${time} ms'`);
    if (typeof callback === "function") {
      callback();
    }
    return $; // return
  };

  $.reload = function(source) {
    if (!source) {
      throw makeError('source');
    }
    source = formatPath(source);
    livereload.listen();
    $.watch(source).pipe(livereload());
    return $; // return
  };

  $.watch = $p.watch;

  $.yargs = $p.yargs;

  listKey = ['backup', 'compile', 'copy', 'delay', 'download', 'isExisted', 'isSame', 'link', 'lint', 'mkdir', 'move', 'read', 'recover', 'remove', 'rename', 'replace', 'say', 'shell', 'source', 'stat', 'unzip', 'update', 'walk', 'write', 'zip'];

  for (j = 0, len1 = listKey.length; j < len1; j++) {
    key = listKey[j];
    $[`${key}Async`] = $[`${key}_`];
  }

  listKey = ['connect', 'disconnect', 'mkdir', 'remove', 'shell', 'upload'];

  for (k = 0, len2 = listKey.length; k < len2; k++) {
    key = listKey[k];
    $.ssh[`${key}Async`] = $.ssh[`${key}_`];
  }

}).call(this);
