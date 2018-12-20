(function() {
  // require
  /*
  excludeInclude(source)
  formatArgument(arg)
  formatPath(source)
  getPlugin(name)
  getRelativePath(source, target)
  normalizePath(source)
  wrapList(list)
  */
  /*
  fetchGitHub_(name)
  */
  var $, SSH, Shell, _, excludeInclude, fetchGitHub_, formatArgument, formatPath, fs, fse, getPlugin, gulp, gulpIf, j, k, key, kleur, len, len1, listKey, normalizePath, path, plumber, string, using, wrapList;

  path = require('path');

  fs = require('fs');

  fse = require('fs-extra');

  gulp = require('gulp');

  kleur = require('kleur');

  $ = require('estus-flask');

  ({_} = $);

  // return
  module.exports = $;

  $.library = {_, fse, gulp};

  excludeInclude = function(source) {
    source = formatArgument(source);
    source.push('!**/include/**');
    return source = _.uniq(source); // return
  };

  formatArgument = function(arg) {
    var type;
    switch (type = $.type(arg)) {
      case 'array':
        return _.clone(arg);
      case 'string':
        return [arg];
      default:
        throw new Error(`invalid type '${type}'`);
    }
  };

  formatPath = function(source) {
    var j, len, results, src;
    source = formatArgument(source);
    results = [];
    for (j = 0, len = source.length; j < len; j++) {
      src = source[j];
      results.push(normalizePath(src));
    }
    return results;
  };

  getPlugin = function(name) {
    var base1, base2;
    if (name === 'uglify') {
      return (base1 = $.plugin).uglify || (base1.uglify = (function() {
        var composer, uglifyEs;
        uglifyEs = require('uglify-es');
        composer = require('gulp-uglify/composer');
        return composer(uglifyEs, console);
      })());
    }
    return (base2 = $.plugin)[name] || (base2[name] = require(name));
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
          throw new Error('invalid type');
      }
    })();
    return ((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = list.length; j < len; j++) {
        key = list[j];
        results.push(`'${key}'`);
      }
      return results;
    })()).join(', ');
  };

  // return
  $.fn = {excludeInclude, formatArgument, formatPath, normalizePath, wrapList};

  /*
  $.fn.require(source)
  */
  $.fn.require = function(source) {
    return require(normalizePath(source));
  };

  $.plugin = {};

  gulpIf = getPlugin('gulp-if');

  plumber = getPlugin('gulp-plumber');

  using = getPlugin('gulp-using');

  /*
  os
  path
  */
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

  fetchGitHub_ = async function(name) {
    var source;
    source = normalizePath(`./../${(name.split('/')[1])}`);
    if ((await $.isExisted_(source))) {
      return (await $.exec_([`cd ${source}`, 'git fetch', 'git pull']));
    }
    return (await $.exec_(`git clone https://github.com/${name}.git ${source}`));
  };

  /*
  task(name, [fn])
  */
  // task
  $.task = function(...arg) {
    var _fn, fn, listTask, name, type;
    [name, fn] = arg;
    listTask = gulp._registry._tasks;
    // get task list
    if (!name) {
      return listTask;
    }
    // get function via name
    if (!fn) {
      return listTask[name];
    }
    // set new task
    type = $.type(fn);
    if (type !== 'async function' && type !== 'function') {
      $.info('warning', `invalid type of '${name}()': '${type}'`);
    }
    if (type !== 'async function') {
      // generate a wrapper
      _fn = fn;
      fn = function() {
        return new Promise(function(resolve) {
          _fn();
          return resolve();
        });
      };
    }
    return gulp.task(name, fn);
  };

  // added default tasks
  /*
  default()
  gurumin()
  kokoro()
  noop()
  prune()
  update()
  */
  $.task('default', function() {
    var key, list;
    list = (function() {
      var results;
      results = [];
      for (key in gulp._registry._tasks) {
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
    var LIST, filename, isSame, j, len, listClean, results, source, target;
    await fetchGitHub_('phonowell/kokoro');
    // clean
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    await $.remove_(listClean);
    $.info.resume('kokoro');
    // copy
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md'];
    results = [];
    for (j = 0, len = LIST.length; j < len; j++) {
      filename = LIST[j];
      source = `./../kokoro/${filename}`;
      target = `./${filename}`;
      isSame = (await $.isSame_([source, target]));
      if (isSame === true) {
        continue;
      }
      await $.copy_(source, './');
      results.push((await $.exec_(`git add -f ${$.path.base}/${filename}`)));
    }
    return results;
  });

  $.task('noop', function() {
    return null;
  });

  $.task('prune', async function() {
    var base, line, listDirectory, listExtension, listFile, listSource;
    await $.exec_('npm prune');
    base = './node_modules';
    // file
    listFile = ['.DS_Store', '.appveyor.yml', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.flowconfig', '.gitattributes', '.gitlab-ci.yml', '.htmllintrc', '.jshintrc', '.lint', '.npmignore', '.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', '.stylelintrc.yaml', '.stylelintrc.yml', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENSE', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'circle.yml', 'eslint', 'gulpfile.js', 'htmllint.js', 'jest.config.js', 'karma.conf.js', 'license', 'stylelint.config.js', 'tsconfig.json'];
    listSource = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = listFile.length; j < len; j++) {
        line = listFile[j];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $.remove_(listSource);
    // directory
    listDirectory = ['.circleci', '.github', '.idea', '.nyc_output', '.vscode', '__tests__', 'assets', 'coverage', 'doc', 'docs', 'example', 'examples', 'images', 'powered-test', 'test', 'tests', 'website'];
    listSource = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = listDirectory.length; j < len; j++) {
        line = listDirectory[j];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $.remove_(listSource);
    // extension
    listExtension = ['.coffee', '.jst', '.markdown', '.md', '.swp', '.tgz', '.ts'];
    listSource = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = listExtension.length; j < len; j++) {
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
    return (await $.exec_('npm prune'));
  });

  /*
  backup_(source)
  recover_(source)
  */
  $.backup_ = async function(source) {
    var extname, j, len, src, suffix;
    source = (await $.source_(source));
    for (j = 0, len = source.length; j < len; j++) {
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
    var bak, basename, j, len, src;
    source = formatPath(source);
    for (j = 0, len = source.length; j < len; j++) {
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
  $.chain = function(...arg) {
    var base1;
    (base1 = $.chain).fn || (base1.fn = require('achain'));
    return $.chain.fn(...arg);
  };

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
              throw new Error('invalid type');
            })();
          case 3:
            return arg;
          default:
            throw new Error('invalid argument length');
        }
      })();
      source = formatPath(source);
      extname = path.extname(source[0]).replace(/\./, '');
      if (!extname.length) {
        throw new Error(`invalid extname '${extname}'`);
      }
      method = (function() {
        switch (extname) {
          case 'markdown':
            return 'md';
          case 'yml':
            return 'yaml';
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
        throw new Error('invalid extname');
      }
      await compile_(source, target, option);
      $.info('compile', `compiled ${wrapList(source)} to ${wrapList(target)}`);
      return $; // return
    };
    /*
    coffee_(source, target, option)
    css_(source, target, option)
    js_(source, target, option)
    md_(source, target, option)
    pug_(source, target, option)
    styl_(source, target, option)
    yaml_(source, target, option)
    */
    fn_.coffee_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var coffee, include, sourcemaps, uglify;
        // require
        coffee = getPlugin('gulp-coffee');
        include = getPlugin('gulp-include');
        uglify = getPlugin('uglify');
        if (option.harmony == null) {
          option.harmony = true;
        }
        if (!option.harmony) {
          option.transpile = {
            presets: ['env']
          };
        }
        delete option.harmony;
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(include()).pipe(coffee(option)).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.css_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var cleanCss, sourcemaps;
        // require
        cleanCss = getPlugin('gulp-clean-css');
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(gulpIf(option.minify, cleanCss())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.js_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var sourcemaps, uglify;
        // require
        uglify = getPlugin('uglify');
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.md_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var htmlmin, markdown, rename, sourcemaps;
        // require
        htmlmin = getPlugin('gulp-htmlmin');
        markdown = getPlugin('gulp-markdown');
        rename = getPlugin('gulp-rename');
        if (option.sanitize == null) {
          option.sanitize = true;
        }
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(markdown(option)).pipe(rename({
          extname: '.html'
        })).pipe(gulpIf(option.minify, htmlmin({
          collapseWhitespace: true
        }))).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.pug_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var pug, sourcemaps;
        // require
        pug = getPlugin('gulp-pug');
        if (option.pretty == null) {
          option.pretty = !option.minify;
        }
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.styl_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var sourcemaps, stylus;
        // require
        stylus = getPlugin('gulp-stylus');
        if (option.compress == null) {
          option.compress = option.minify;
        }
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(stylus(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    fn_.yaml_ = async function(source, target, option) {
      return (await new Promise(function(resolve) {
        var sourcemaps, yaml;
        // require
        yaml = getPlugin('gulp-yaml');
        if (option.safe == null) {
          option.safe = true;
        }
        sourcemaps = option.map;
        return gulp.src(source, {sourcemaps}).pipe(plumber()).pipe(using()).pipe(yaml(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
          return resolve();
        });
      }));
    };
    // return
    return $.compile_ = fn_;
  })();

  // https://github.com/kevva/download
  /*
  download_(source, target, [option])
  */
  $.download_ = async function(...arg) {
    var download, msg, option, source, target;
    [source, target, option] = (function() {
      switch (arg.length) {
        case 2:
          return [arg[0], arg[1], null];
        case 3:
          return arg;
        default:
          throw new Error('invalid argument length');
      }
    })();
    target = normalizePath(target);
    if ($.type(option) === 'string') {
      option = {
        filename: option
      };
    }
    // this function download was from plugin
    download = getPlugin('download');
    await download(source, target, option);
    msg = `downloaded ${wrapList(source)} to ${wrapList(target)}`;
    if (option) {
      msg += `, as '${$.parseString(option)}'`;
    }
    $.info('download', msg);
    return $; // return
  };

  Shell = (function() {
    class Shell {
      /*
      close()
      execute_(cmd, [option])
      info([type], string)
      spawn
      */
      close() {
        this.process.kill();
        return this;
      }

      async execute_(cmd, option = {}) {
        await new Promise((resolve) => {
          var arg, cmder, isIgnoreError, type;
          type = $.type(cmd);
          cmd = (function() {
            switch (type) {
              case 'array':
                return cmd.join(' && ');
              case 'string':
                return cmd;
              default:
                throw new Error('invalid type');
            }
          })();
          $.info('exec', cmd);
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
        return this;
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
              throw new Error('invalid argument length');
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
              return kleur.red(string);
            default:
              return kleur.gray(string);
          }
        })();
        return $.log(string);
      }

    };

    Shell.prototype.spawn = require('child_process').spawn;

    return Shell;

  }).call(this);

  // return
  $.exec_ = async function(cmd, option) {
    var shell;
    shell = new Shell();
    if (!cmd) {
      return shell;
    }
    return (await shell.execute_(cmd, option));
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
          throw new Error('invalid argument length');
      }
    })();
    source = formatPath(source);
    if (target) {
      target = normalizePath(target);
    }
    await new Promise(function(resolve) {
      var rename;
      // require
      rename = getPlugin('gulp-rename');
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
    var j, len, src;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    for (j = 0, len = source.length; j < len; j++) {
      src = source[j];
      if (!(await fse.pathExists(src))) {
        return false;
      }
    }
    return true; // return
  };

  $.isSame_ = async function(source) {
    var CONT, SIZE, cont, j, k, len, len1, size, src, stat;
    source = formatPath(source);
    if (!source.length) {
      return false;
    }
    // check size
    SIZE = null;
    for (j = 0, len = source.length; j < len; j++) {
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
    for (k = 0, len1 = source.length; k < len1; k++) {
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
      throw new Error('invalid argument length');
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
      throw new Error('invalid argument length');
    }
    source = formatPath(source);
    listPromise = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = source.length; j < len; j++) {
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
      throw new Error('invalid argument length');
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
    var jsYaml, res;
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
          return $.parseString(res);
        case 'json':
          return $.parseJSON(res);
        case 'yaml':
        case 'yml':
          // require
          jsYaml = getPlugin('js-yaml');
          return jsYaml.safeLoad(res); // return
        default:
          return res;
      }
    })();
  };

  $.remove_ = async function(source) {
    var j, len, listSource, src;
    listSource = (await $.source_(source));
    for (j = 0, len = listSource.length; j < len; j++) {
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
    var item, j, len, listHistory;
    source = formatPath(source);
    listHistory = [];
    await new Promise(function(resolve) {
      var rename;
      // require
      rename = getPlugin('gulp-rename');
      return gulp.src(source).pipe(plumber()).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
        listHistory.push(e.history);
        return e.base;
      })).on('end', function() {
        return resolve();
      });
    });
    $.info.pause('$.rename_');
    for (j = 0, len = listHistory.length; j < len; j++) {
      item = listHistory[j];
      if ((await $.isExisted_(item[1]))) {
        await $.remove_(item[0]);
      }
    }
    $.info.resume('$.rename_');
    $.info('file', `renamed ${wrapList(source)} as '${$.parseString(option)}'`);
    return $; // return
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
    var ref;
    source = normalizePath(source);
    if ((ref = $.type(data)) === 'array' || ref === 'object') {
      data = $.parseString(data);
    }
    await fse.outputFile(source, data, option);
    $.info('file', `wrote ${wrapList(source)}`);
    return $; // return
  };

  /*
  getName(source)
  */
  $.getName = function(source) {
    /*
    basename
    dirname
    extname
    filename
    */
    var basename, dirname, extname, filename;
    if (!((source != null ? source.length : void 0) || source > 0)) {
      throw new Error(`invalid source '${source}'`);
    }
    extname = path.extname(source);
    basename = path.basename(source, extname);
    dirname = path.dirname(source);
    filename = `${basename}${extname}`;
    // return
    return {basename, dirname, extname, filename};
  };

  /*
  getBasename(source)
  getDirname(source)
  getExtname(source)
  getFilename(source)
  */
  $.getBasename = function(source) {
    var basename;
    ({basename} = $.getName(source));
    return basename; // return
  };

  $.getDirname = function(source) {
    var dirname;
    ({dirname} = $.getName(source));
    return dirname; // return
  };

  $.getExtname = function(source) {
    var extname;
    ({extname} = $.getName(source));
    return extname; // return
  };

  $.getFilename = function(source) {
    var filename;
    ({filename} = $.getName(source));
    return filename; // return
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
        throw new Error('invalid extname');
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
            throw new Error('invalid extname');
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
        var coffeelint, stream;
        // require
        coffeelint = getPlugin('gulp-coffeelint');
        (stream = gulp.src(source)).on('end', function() {
          return resolve();
        });
        return stream.pipe(plumber()).pipe(using()).pipe(coffeelint()).pipe(coffeelint.reporter());
      });
    };
    fn_.markdown_ = function(source) {
      return new Promise(async function(resolve) {
        var markdownlint, option;
        // require
        markdownlint = getPlugin('markdownlint');
        option = {
          files: (await $.source_(source))
        };
        return markdownlint(option, function(err, result) {
          var filename, item, j, len, list, listMsg;
          if (err) {
            throw err;
          }
          for (filename in result) {
            list = result[filename];
            if ($.type(list) !== 'array') {
              continue;
            }
            filename = filename.replace($.info['__reg_base__'], '.').replace($.info['__reg_home__'], '~');
            $.i(kleur.magenta(filename));
            for (j = 0, len = list.length; j < len; j++) {
              item = list[j];
              listMsg = [];
              listMsg.push(kleur.gray(`#${item.lineNumber}`));
              if (item.errorContext) {
                listMsg.push(`< ${kleur.red(item.errorContext)} >`);
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
        var stream, stylint;
        // require
        stylint = getPlugin('gulp-stylint');
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
  prompt(option)
  */
  $.prompt = async function(option) {
    var base1, i, item, j, len, ref, ref1, res, type;
    type = $.type(option);
    if (type !== 'object') {
      throw new Error(`invalid type '${type}'`);
    }
    // default value
    option.initial || (option.initial = option.default);
    option.message || (option.message = $.prompt.mapMessage[option.type] || 'input');
    option.name || (option.name = 'value');
    if ((ref = option.type) === 'autocomplete' || ref === 'multiselect' || ref === 'select') {
      if (!(option.choices || (option.choices = option.choice))) {
        throw new Error('got no choice(s)');
      }
      ref1 = option.choices;
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        item = ref1[i];
        type = $.type(item);
        if (type === 'object') {
          continue;
        }
        option.choices[i] = {
          title: item,
          value: item
        };
      }
    } else if (option.type === 'toggle') {
      option.active || (option.active = 'on');
      option.inactive || (option.inactive = 'off');
    }
    
    // execute
    (base1 = $.prompt).fn || (base1.fn = require('prompts'));
    res = (await $.prompt.fn(option));
    // return
    if (option.raw) {
      return res;
    }
    return res[option.name];
  };

  $.prompt.mapMessage = {
    confirm: 'confirm',
    multiselect: 'select',
    number: 'input number',
    select: 'select',
    text: 'input text',
    toggle: 'toggle'
  };

  /*
  replace_(source, option...)
  */
  $.replace_ = async function(source, ...option) {
    var callback, cont, j, len, listSource, msg, reg, replacement, res, src;
    if (!source) {
      throw new Error('invalid source');
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
        throw new Error('invalid argument length');
    }
    msg = callback ? 'replaced with function' : `replaced '${reg}' to '${replacement}'`;
    for (j = 0, len = listSource.length; j < len; j++) {
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
    var j, len, listMessage, msg, type;
    type = $.type(text);
    listMessage = (function() {
      switch (type) {
        case 'array':
          return text;
        case 'boolean':
        case 'number':
        case 'string':
          return [text];
        default:
          throw new Error(`invalid type '${type}'`);
      }
    })();
    for (j = 0, len = listMessage.length; j < len; j++) {
      msg = listMessage[j];
      $.info('say', msg);
      if ($.os !== 'macos') {
        continue;
      }
      msg = $.parseString(msg).replace(/[#\(\)-]/g, '');
      msg = _.trim(msg);
      if (!msg.length) {
        continue;
      }
      $.info.pause('$.say_');
      await $.exec_(`say ${msg}`);
      $.info.resume('$.say_');
    }
    return text; // return
  };

  /*
  source_(source, [option])
  */
  $.source_ = async function(source, option) {
    source = formatPath(source);
    option = _.merge({
      allowEmpty: true,
      read: false
    }, option);
    return (await new Promise(function(resolve) {
      var listSource;
      listSource = [];
      return gulp.src(source, option).on('data', function(item) {
        return listSource.push(item.path);
      }).on('end', function() {
        return resolve(listSource);
      });
    }));
  };

  // https://github.com/mscdex/ssh2
  SSH = class SSH {
    /*
    connect_(option)
    disconnect_()
    exec_(cmd, [option])
    info(chunk)
    mkdir_(source)
    remove_(source)
    uploadDir_(sftp, source, target)
    uploadFile_(sftp, source, target)
    upload_(source, target, [option])
    */
    async connect_(option) {
      await new Promise((resolve) => {
        var Client, conn, infoServer;
        ({Client} = require('ssh2'));
        conn = new Client();
        infoServer = `${option.username}@${option.host}`;
        conn.on('end', function() {
          return $.info('ssh', `disconnected from '${infoServer}'`);
        }).on('error', function(err) {
          throw err;
        }).on('ready', function() {
          $.info('ssh', `connected to '${infoServer}'`);
          return resolve();
        }).connect(option);
        return this.storage = {conn, option};
      });
      return this;
    }

    async disconnect_() {
      await new Promise((resolve) => {
        var conn;
        ({conn} = this.storage);
        return conn.on('end', function() {
          return resolve();
        }).end();
      });
      return this;
    }

    async exec_(cmd, option = {}) {
      await new Promise((resolve) => {
        var conn;
        ({conn} = this.storage);
        cmd = formatArgument(cmd);
        cmd = cmd.join(' && ');
        $.info('ssh', kleur.blue(cmd));
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
      return this;
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
        var j, len, results;
        results = [];
        for (j = 0, len = source.length; j < len; j++) {
          src = source[j];
          results.push(`mkdir -p ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$.ssh.mkdir_');
      await this.exec_(cmd);
      $.info.resume('$.ssh.mkdir_');
      $.info('ssh', `created ${wrapList(source)}`);
      return this;
    }

    async remove_(source) {
      var cmd, src;
      source = formatArgument(source);
      cmd = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = source.length; j < len; j++) {
          src = source[j];
          results.push(`rm -fr ${src}`);
        }
        return results;
      })()).join('; ');
      $.info.pause('$.ssh.remove_');
      await this.exec_(cmd);
      $.info.resume('$.ssh.remove_');
      $.info('ssh', `removed ${wrapList(source)}`);
      return this;
    }

    async upload_(source, target, option = {}) {
      await new Promise((resolve) => {
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
              throw new Error('invalid type');
          }
        })();
        return conn.sftp(async(err, sftp) => {
          var filename, j, len, src, stat;
          if (err) {
            throw err;
          }
          for (j = 0, len = source.length; j < len; j++) {
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
      return this;
    }

    async uploadDir_(sftp, source, target) {
      await new Promise(async(resolve) => {
        var j, len, listSource, relativeTarget, src, stat;
        listSource = [];
        await $.walk_(source, function(item) {
          return listSource.push(item.path);
        });
        for (j = 0, len = listSource.length; j < len; j++) {
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
      return this;
    }

    async uploadFile_(sftp, source, target) {
      await new Promise(function(resolve) {
        return sftp.fastPut(source, target, function(err) {
          if (err) {
            throw err;
          }
          $.info('ssh', `uploaded '${source}' to '${target}'`);
          return resolve();
        });
      });
      return this;
    }

  };

  
  // return
  $.ssh = new SSH();

  /*
  unzip_(source, [target])
  */
  $.unzip_ = async function(source, target) {
    var dist, j, len, listSource, src, unzip;
    if (!source) {
      throw new Error('invalid source');
    }
    listSource = (await $.source_(source));
    // require
    unzip = getPlugin('unzip');
    for (j = 0, len = listSource.length; j < len; j++) {
      src = listSource[j];
      dist = target || $.getDirname(src);
      await new Promise(function(resolve) {
        var stream;
        stream = fs.createReadStream(src);
        stream.on('end', function() {
          return resolve();
        });
        return stream.pipe(unzip.Extract({
          path: dist
        }));
      });
      $.info('zip', `unzipped ${src} to ${dist}`);
    }
    return $; // return
  };

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
      var current, latest, name, registry, results, version;
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
        $.info('update', `'${name}': '${current}' ${kleur.green('->')} '${latest}'`);
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
      await $.exec_(listCmd);
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
        throw new Error('invalid source');
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
      throw new Error('invalid argument length');
    }
    source = normalizePath(source);
    await new Promise(function(resolve) {
      var walk;
      // require
      walk = getPlugin('klaw');
      return walk(source).on('data', function(item) {
        return callback(item);
      }).on('end', function() {
        return resolve();
      });
    });
    return $; // return
  };

  /*
  zip_(source, [target], [option])
  */
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
          throw new Error('invalid argument length');
      }
    })();
    _source = source;
    source = formatPath(source);
    target || (target = $.getDirname(source[0]).replace(/\*/g, ''));
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
            throw new Error('invalid type');
        }
      })();
      if (~_source.search(/\*/)) {
        return _.trim(_source.replace(/\*.*/, ''), '/');
      }
      return path.dirname(_source);
    })());
    base = normalizePath(base);
    filename || (filename = `${$.getBasename(target)}.zip`);
    filename = `${target}/${filename}`;
    await new Promise(async function(resolve) {
      var ansi, archive, archiver, j, len, listSource, msg, name, output, src;
      // require
      ansi = getPlugin('sisteransi');
      archiver = getPlugin('archiver');
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
        gray = kleur.gray(`${Math.floor(e.fs.processedBytes * 100 / e.fs.totalBytes)}%`);
        magenta = kleur.magenta(msg);
        msg = `${gray} ${magenta}`;
        $.i([ansi.erase.line, msg, ansi.cursor.up()].join(''));
        return msg = null;
      });
      archive.on('end', function() {
        return resolve();
      });
      archive.pipe(output);
      listSource = (await $.source_(source));
      for (j = 0, len = listSource.length; j < len; j++) {
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
    var livereload;
    if (!source) {
      throw new Error('invalid source');
    }
    source = formatPath(source);
    // require
    livereload = getPlugin('gulp-livereload');
    livereload.listen();
    $.watch(source).pipe(livereload());
    return $; // return
  };

  $.watch = getPlugin('gulp-watch');

  $.yargs = getPlugin('yargs');

  $.argv = $.plugin.yargs.argv;

  listKey = ['backup', 'compile', 'copy', 'delay', 'download', 'exec', 'isExisted', 'isSame', 'link', 'lint', 'mkdir', 'move', 'read', 'recover', 'remove', 'rename', 'replace', 'say', 'source', 'stat', 'unzip', 'update', 'walk', 'write', 'zip'];

  for (j = 0, len = listKey.length; j < len; j++) {
    key = listKey[j];
    $[`${key}Async`] = $[`${key}_`];
  }

  // ssh
  listKey = ['connect', 'disconnect', 'exec', 'mkdir', 'remove', 'upload', 'uploadDir', 'uploadFile'];

  for (k = 0, len1 = listKey.length; k < len1; k++) {
    key = listKey[k];
    $.ssh[`${key}Async`] = $.ssh[`${key}_`];
  }

}).call(this);
