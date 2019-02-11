(function() {
  // require
  /*
  compile_(source, [target], [option])
  */
  /*
  lint_(source)
  */
  /*
  excludeInclude(source)
  formatArgument(arg)
  getPlugin(name)
  normalizePath(string)
  normalizePathToArray(source)
  wrapList(list)
  */
  /*
  fetchGitHub_(name)
  */
  var $, Compiler, Linter, Prompt, SSH, Shell, Updater, _, excludeInclude, fetchGitHub_, formatArgument, fs, fse, getPlugin, gulp, gulpIf, j, k, key, kleur, len, len1, listKey, normalizePath, normalizePathToArray, path, string, using, wrapList,
    indexOf = [].indexOf;

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

  normalizePath = function(string) {
    var isIgnore;
    if ('string' !== $.type(string)) {
      return null;
    }
    // check isIgnore
    if (string[0] === '!') {
      isIgnore = true;
      string = string.slice(1);
    }
    // replace . & ~
    string = string.replace(/\.{2}/g, '__parent_directory__');
    string = (function() {
      switch (string[0]) {
        case '.':
          return string.replace(/\./, $.path.base);
        case '~':
          return string.replace(/~/, $.path.home);
        default:
          return string;
      }
    })();
    string = string.replace(/__parent_directory__/g, '..');
    // replace ../ to ./../ at start
    if (string[0] === '.' && string[1] === '.') {
      string = `${$.path.base}/${string}`;
    }
    // normalize
    string = path.normalize(string).replace(/\\/g, '/');
    // absolute
    if (!path.isAbsolute(string)) {
      string = `${$.path.base}/${string}`;
    }
    // ignore
    if (isIgnore) {
      string = `!${string}`;
    }
    return string; // return
  };

  normalizePathToArray = function(source) {
    var groupSource, j, len, results;
    groupSource = formatArgument(source);
    results = [];
    for (j = 0, len = groupSource.length; j < len; j++) {
      source = groupSource[j];
      results.push(normalizePath(source));
    }
    return results;
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
  $.fn = {excludeInclude, formatArgument, getPlugin, normalizePath, normalizePathToArray, wrapList};

  /*
  $.fn.require(source)
  */
  $.fn.require = function(source) {
    return require(normalizePath(source));
  };

  $.plugin = {};

  gulpIf = getPlugin('gulp-if');

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
    var _fn, fn, mapResult, mapTask, name, type;
    [name, fn] = arg;
    mapTask = gulp._registry._tasks;
    // get task list
    if (!name) {
      mapResult = {};
      for (name in mapTask) {
        mapResult[name] = mapTask[name].unwrap();
      }
      return mapResult;
    }
    // get function via name
    if (!fn) {
      return mapTask[name].unwrap();
    }
    // set new task
    type = $.type(fn);
    if (type !== 'async function' && type !== 'function') {
      $.info('warning', `invalid type of '${name}()': '${type}'`);
    }
    if (type !== 'async function') {
      // generate a wrapper
      _fn = fn;
      fn = async function() {
        await new Promise(function(resolve) {
          return resolve();
        });
        return _fn();
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

  // https://github.com/tj/node-prune
  $.task('prune', async function() {
    var base, line, listDirectory, listExtension, listFile, listSource;
    await $.exec_('npm prune');
    base = './node_modules';
    // file
    listFile = ['.DS_Store', '.appveyor.yml', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.flowconfig', '.gitattributes', '.gitlab-ci.yml', '.htmllintrc', '.jshintrc', '.lint', '.npmignore', '.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', '.stylelintrc.yaml', '.stylelintrc.yml', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENCE', 'LICENCE-MIT', 'LICENCE.BSD', 'LICENCE.txt', 'LICENSE', 'LICENSE-MIT', 'LICENSE.BSD', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'changelog', 'circle.yml', 'eslint', 'gulpfile.js', 'htmllint.js', 'jest.config.js', 'karma.conf.js', 'licence', 'license', 'stylelint.config.js', 'tsconfig.json'];
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
    listExtension = ['.coffee', '.jst', '.markdown', '.md', '.mkd', '.swp', '.tgz', '.ts'];
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
    return (await $.update_({registry}));
  });

  /*
  backup_(source)
  recover_(source)
  */
  $.backup_ = async function(source) {
    var extname, j, len, listSource, msg, suffix;
    listSource = (await $.source_(source));
    msg = `backed up ${wrapList(source)}`;
    for (j = 0, len = listSource.length; j < len; j++) {
      source = listSource[j];
      suffix = $.getExtname(source);
      extname = '.bak';
      $.info.pause('$.backup_');
      await $.copy_(source, null, {suffix, extname});
      $.info.resume('$.backup_');
    }
    $.info('backup', msg);
    return $; // return
  };

  $.recover_ = async function(source) {
    var filename, groupSource, j, len, msg, pathBak;
    groupSource = normalizePathToArray(source);
    msg = `recovered ${wrapList(source)}`;
    for (j = 0, len = groupSource.length; j < len; j++) {
      source = groupSource[j];
      pathBak = `${source}.bak`;
      if (!(await $.isExisted_(pathBak))) {
        $.info('recover', `'${pathBak}' not found`);
        continue;
      }
      filename = $.getFilename(source);
      $.info.pause('$.recover_');
      await $.chain($).remove_(source).copy_(pathBak, null, filename).remove_(pathBak);
      $.info.resume('$.recover_');
    }
    $.info('recover', msg);
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

  /*
  clean_(source)
  */
  $.clean_ = async function(source) {
    var listSource, pathDir, type;
    type = $.type(source);
    if (type !== 'string') {
      throw new Error(`invalid type '${type}'`);
    }
    await $.remove_(source);
    pathDir = $.getDirname(source);
    listSource = (await $.source_(`${pathDir}/**/*`));
    if (listSource.length) {
      return $;
    }
    await $.remove_(pathDir);
    return $; // return
  };

  Compiler = (function() {
    class Compiler {
      /*
      compileCoffee_(source, target, option)
      compileCss_(source, target, option)
      compileJs_(source, target, option)
      compileMd_(source, target, option)
      compilePug_(source, target, option)
      compileStyl_(source, target, option)
      compileYaml_(source, target, option)
      execute_(arg...)
      */
      async compileCoffee_(source, target, option) {
        await new Promise(function(resolve) {
          var base, coffee, include, sourcemaps, uglify;
          coffee = getPlugin('gulp-coffee');
          include = getPlugin('gulp-include');
          uglify = getPlugin('uglify');
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(include()).pipe(coffee(option)).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compileCss_(source, target, option) {
        await new Promise(function(resolve) {
          var base, cleanCss, sourcemaps;
          cleanCss = getPlugin('gulp-clean-css');
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(gulpIf(option.minify, cleanCss())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compileJs_(source, target, option) {
        await new Promise(function(resolve) {
          var base, sourcemaps, uglify;
          uglify = getPlugin('uglify');
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(gulpIf(option.minify, uglify())).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compileMd_(source, target, option) {
        await new Promise(function(resolve) {
          var base, htmlmin, markdown, rename, sourcemaps;
          htmlmin = getPlugin('gulp-htmlmin');
          markdown = getPlugin('gulp-markdown');
          rename = getPlugin('gulp-rename');
          if (option.sanitize == null) {
            option.sanitize = true;
          }
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(markdown(option)).pipe(rename({
            extname: '.html'
          })).pipe(gulpIf(option.minify, htmlmin({
            collapseWhitespace: true
          }))).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compilePug_(source, target, option) {
        await new Promise(function(resolve) {
          var base, pug, sourcemaps;
          pug = getPlugin('gulp-pug');
          if (option.pretty == null) {
            option.pretty = !option.minify;
          }
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(pug(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compileStyl_(source, target, option) {
        await new Promise(function(resolve) {
          var base, sourcemaps, stylus;
          stylus = getPlugin('gulp-stylus');
          if (option.compress == null) {
            option.compress = option.minify;
          }
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base, sourcemaps}).pipe(using()).pipe(stylus(option)).pipe(gulp.dest(target, {sourcemaps})).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async compileYaml_(source, target, option) {
        await new Promise(function(resolve) {
          var base, sourcemaps, yaml;
          yaml = getPlugin('gulp-yaml');
          if (option.safe == null) {
            option.safe = true;
          }
          base = option.base;
          sourcemaps = option.map;
          return gulp.src(source, {base}).pipe(using()).pipe(yaml(option)).pipe(gulp.dest(target)).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

      async execute_(...arg) {
        var dirname, extname, j, len, listSource, method, msg, option, source, target, type;
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
                throw new Error(`invalid type '${type}'`);
              })();
            case 3:
              return arg;
            default:
              throw new Error('invalid argument length');
          }
        })();
        option = _.extend({
          map: false,
          minify: true
        }, option);
        // message
        msg = `compiled ${wrapList(source)}`;
        if (target) {
          msg += ` to ${wrapList(target)}`;
        }
        // base
        type = $.type(source);
        if (type === 'string' && ~source.search(/\/\*/)) {
          option.base || (option.base = normalizePath(source).replace(/\/\*.*/, ''));
        }
        // each & compile
        listSource = (await $.source_(source));
        for (j = 0, len = listSource.length; j < len; j++) {
          source = listSource[j];
          ({extname, dirname} = $.getName(source));
          method = this.mapMethod[extname];
          method || (function() {
            throw new Error(`invalid extname '${extname}'`);
          })();
          target || (target = dirname);
          target = normalizePath(target);
          await this[method](source, target, option);
        }
        $.info('compile', msg);
        return this;
      }

    };

    /*
    mapMethod
    */
    Compiler.prototype.mapMethod = {
      '.coffee': 'compileCoffee_',
      '.css': 'compileCss_',
      '.js': 'compileJs_',
      '.md': 'compileMd_',
      '.pug': 'compilePug_',
      '.styl': 'compileStyl_',
      '.yaml': 'compileYaml_',
      '.yml': 'compileYaml_'
    };

    return Compiler;

  }).call(this);

  
  // return
  $.compile_ = async function(...arg) {
    var compiler;
    compiler = new Compiler();
    await compiler.execute_(...arg);
    return $; // return
  };

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
      parseMessage(buffer)
      */
      close() {
        this.process.kill();
        return this;
      }

      async execute_(cmd, option = {}) {
        var arg, cmder, isIgnoreError, isSilent, result, status, type;
        type = $.type(cmd);
        cmd = (function() {
          switch (type) {
            case 'array':
              return cmd.join(' && ');
            case 'string':
              return cmd;
            default:
              throw new Error(`invalid type '${type}'`);
          }
        })();
        isIgnoreError = !!option.ignoreError;
        delete option.ignoreError;
        isSilent = !!option.silent;
        delete option.silent;
        [cmder, arg] = $.os === 'windows' ? ['cmd.exe', ['/s', '/c', cmd]] : ['/bin/sh', ['-c', cmd]];
        if (!isSilent) {
          $.info('exec', cmd);
        }
        [status, result] = (await new Promise((resolve) => {
          var res;
          res = null;
          this.process = this.spawn(cmder, arg, option);
          // bind
          this.process.stderr.on('data', (data) => {
            res = this.parseMessage(data);
            if (!isSilent) {
              return this.info('error', data);
            }
          });
          this.process.stdout.on('data', (data) => {
            res = this.parseMessage(data);
            if (!isSilent) {
              return this.info(data);
            }
          });
          return this.process.on('close', function(code) {
            if (code === 0 || isIgnoreError) {
              return resolve([true, res]);
            }
            return resolve([false, res]);
          });
        }));
        return [
          status,
          result // return
        ];
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

      parseMessage(buffer) {
        return _.trimEnd($.parseString(buffer), '\n');
      }

    };

    /*
    spawn
    */
    Shell.prototype.spawn = require('child_process').spawn;

    return Shell;

  }).call(this);

  // return
  $.exec_ = async function(cmd, option) {
    var shell;
    if (!cmd) {
      return false;
    }
    shell = new Shell();
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
    source = normalizePathToArray(source);
    target = normalizePath(target);
    if (!source.length) {
      return $;
    }
    await new Promise(function(resolve) {
      var rename;
      // require
      rename = getPlugin('gulp-rename');
      return gulp.src(source, {
        allowEmpty: true
      }).pipe(using()).pipe(gulpIf(!!option, rename(option))).pipe(gulp.dest(function(e) {
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
    var groupSource, isExisted, j, len;
    groupSource = normalizePathToArray(source);
    if (!groupSource.length) {
      return false;
    }
    for (j = 0, len = groupSource.length; j < len; j++) {
      source = groupSource[j];
      isExisted = (await fse.pathExists(source));
      if (!isExisted) {
        return false;
      }
    }
    return true; // return
  };

  $.isSame_ = async function(source) {
    var cache, cont, groupSource, j, k, len, len1, size, stat;
    groupSource = normalizePathToArray(source);
    if (!groupSource.length) {
      return false;
    }
    // check size
    cache = null;
    for (j = 0, len = groupSource.length; j < len; j++) {
      source = groupSource[j];
      stat = (await $.stat_(source));
      if (!stat) {
        return false;
      }
      ({size} = stat);
      if (!cache) {
        cache = size;
        continue;
      }
      if (size !== cache) {
        return false;
      }
    }
    // check content
    cache = null;
    for (k = 0, len1 = groupSource.length; k < len1; k++) {
      source = groupSource[k];
      $.info.pause('$.isSame_');
      cont = (await $.read_(source));
      $.info.resume('$.isSame_');
      if (!cont) {
        return false;
      }
      cont = $.parseString(cont);
      if (!cache) {
        cache = cont;
        continue;
      }
      if (cont !== cache) {
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
      throw new Error('invalid source');
    }
    source = normalizePathToArray(source);
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
    var listSource;
    if (!(source && target)) {
      throw new Error('invalid argument length');
    }
    listSource = (await $.source_(source));
    if (!listSource.length) {
      return $;
    }
    $.info.pause('$.move_');
    await $.copy_(listSource, target);
    await $.remove_(listSource);
    $.info.resume('$.move_');
    $.info('move', `moved ${wrapList(source)} to '${target}'`);
    return $; // return
  };

  $.read_ = async function(source, option = {}) {
    var extname, jsYaml, listSource, pathSource, res;
    pathSource = source;
    listSource = (await $.source_(pathSource));
    if (!(listSource != null ? listSource.length : void 0)) {
      $.info('file', `'${pathSource}' not existed`);
      return null;
    }
    source = listSource[0];
    res = (await new Promise(function(resolve) {
      return fs.readFile(source, function(err, data) {
        if (err) {
          throw err;
        }
        return resolve(data);
      });
    }));
    $.info('file', `read '${source}'`);
    // return
    if (option.raw) {
      return res;
    }
    extname = $.getExtname(source);
    if (extname === '.coffee' || extname === '.css' || extname === '.html' || extname === '.js' || extname === '.md' || extname === '.pug' || extname === '.sh' || extname === '.styl' || extname === '.txt' || extname === '.xml') {
      return $.parseString(res);
    }
    if (extname === '.json') {
      return $.parseJSON(res);
    }
    if (extname === '.yaml' || extname === '.yml') {
      jsYaml = getPlugin('js-yaml');
      return jsYaml.safeLoad(res);
    }
    return res; // return
  };

  $.remove_ = async function(source) {
    var j, len, listSource, msg;
    listSource = (await $.source_(source));
    if (!listSource.length) {
      return $;
    }
    msg = `removed ${wrapList(source)}`;
    for (j = 0, len = listSource.length; j < len; j++) {
      source = listSource[j];
      await fse.remove(source);
    }
    $.info('remove', msg);
    return $; // return
  };

  $.rename_ = async function(source, option) {
    var item, j, len, listHistory;
    source = normalizePathToArray(source);
    listHistory = [];
    await new Promise(function(resolve) {
      var rename;
      // require
      rename = getPlugin('gulp-rename');
      return gulp.src(source).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
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

  Linter = (function() {
    class Linter {
      /*
      execute_(source)
      lintCoffee_(source)
      lintMd_(source)
      lintStyl_(source)
      */
      async execute_(source) {
        var extname, j, len, listSource, method;
        listSource = (await $.source_(source));
        for (j = 0, len = listSource.length; j < len; j++) {
          source = listSource[j];
          extname = $.getExtname(source);
          method = this.mapMethod[extname];
          method || (function() {
            throw new Error(`invalid extname '${extname}'`);
          })();
          await this[method](source);
        }
        return this;
      }

      async lintCoffee_(source) {
        await new Promise(function(resolve) {
          var lint;
          lint = getPlugin('gulp-coffeelint');
          // does not know why
          // have to put 'on()' before 'pipe()'
          // strange
          return gulp.src(source).on('end', function() {
            return resolve();
          }).pipe(using()).pipe(lint()).pipe(lint.reporter());
        });
        return this;
      }

      async lintMd_(source) {
        await new Promise(function(resolve) {
          var lint, option;
          lint = getPlugin('markdownlint');
          option = {
            files: source
          };
          lint(option, function(err, result) {
            var filename, item, list, listMsg, results;
            if (err) {
              throw err;
            }
            results = [];
            for (filename in result) {
              list = result[filename];
              if ('array' !== $.type(list)) {
                continue;
              }
              filename = $.info.renderPath(filename);
              $.i(kleur.magenta(filename));
              results.push((function() {
                var j, len, results1;
                results1 = [];
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
                  results1.push($.i(listMsg.join(' ')));
                }
                return results1;
              })());
            }
            return results;
          });
          return resolve();
        });
        return this;
      }

      async lintStyl_(source) {
        await new Promise(function(resolve) {
          var lint;
          lint = getPlugin('gulp-stylint');
          return gulp.src(source).pipe(using()).pipe(lint()).pipe(lint.reporter()).on('end', function() {
            return resolve();
          });
        });
        return this;
      }

    };

    /*
    mapMethod
    */
    Linter.prototype.mapMethod = {
      '.coffee': 'lintCoffee_',
      '.md': 'lintMd_',
      '.styl': 'lintStyl_'
    };

    return Linter;

  }).call(this);

  
  // return
  $.lint_ = async function(...arg) {
    var linter;
    linter = new Linter();
    await linter.execute_(...arg);
    return $; // return
  };

  Prompt = (function() {
    class Prompt {
      /*
      execute_(option)
      getCache_(option)
      listType
      mapMessage
      namespace
      pathCache
      setCache_(option, value)
      setOption_(option)
      */
      async execute_(option) {
        var res, resRaw, type;
        type = $.type(option);
        if (type !== 'object') {
          throw new Error(`invalid type '${type}'`);
        }
        $.info.pause(this.namespace);
        option = (await this.setOption_(option));
        
        // execute
        this.fn_ || (this.fn_ = require('prompts'));
        resRaw = (await this.fn_(option));
        res = resRaw[option.name];
        await this.setCache_(option, res);
        $.info.resume(this.namespace);
        // return
        if (option.raw) {
          return resRaw;
        }
        return res;
      }

      async getCache_(option) {
        var cache, index, item, ref, type, value;
        if (!option.id) {
          return void 0;
        }
        if (ref = option.type, indexOf.call(this.listType, ref) < 0) {
          return void 0;
        }
        cache = (await $.read_(this.pathCache));
        if (!(item = _.get(cache, option.id))) {
          return void 0;
        }
        ({type, value} = item);
        if (type !== option.type) {
          return void 0;
        }
        // return
        if (type === 'select') {
          index = _.findIndex(option.choices, {value});
          if (!(index > -1)) {
            return void 0;
          }
          return index;
        }
        return value;
      }

      async setCache_(option, value) {
        var cache, id, type;
        ({id, type} = option);
        if (!(id && (value != null) && indexOf.call(this.listType, type) >= 0)) {
          return this;
        }
        cache = (await $.read_(this.pathCache));
        cache || (cache = {});
        cache[option.id] = {type, value};
        await $.write_(this.pathCache, cache);
        return this;
      }

      async setOption_(option) {
        var i, item, j, len, ref, ref1, type;
        // default value
        option.message || (option.message = this.mapMessage[option.type] || 'input');
        option.name || (option.name = 'value');
        if ((ref = option.type) === 'autocomplete' || ref === 'multiselect' || ref === 'select') {
          if (!(option.choices || (option.choices = option.choice || option.list))) {
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
        // have to be here
        // behind option.choices
        option.initial || (option.initial = option.default || (await this.getCache_(option)));
        return option; // return
      }

    };

    Prompt.prototype.listType = ['confirm', 'number', 'select', 'text', 'toggle'];

    Prompt.prototype.mapMessage = {
      confirm: 'confirm',
      multiselect: 'select',
      number: 'input number',
      select: 'select',
      text: 'input text',
      toggle: 'toggle'
    };

    Prompt.prototype.namespace = '$.prompt';

    Prompt.prototype.pathCache = './temp/cache-prompt.json';

    return Prompt;

  }).call(this);

  
  // return
  $.prompt = async function(...arg) {
    var base1, prompt;
    prompt = (base1 = $.prompt).fn || (base1.fn = new Prompt());
    return (await prompt.execute_(...arg));
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
      await $.exec_(`say ${msg}`, {
        silent: true
      });
    }
    return $; // return
  };

  /*
  source_(source, [option])
  */
  $.source_ = async function(source, option) {
    var groupSource;
    groupSource = normalizePathToArray(source);
    option = _.merge({
      allowEmpty: true,
      read: false
    }, option);
    return (await new Promise(function(resolve) {
      var listSource;
      listSource = [];
      if (!groupSource.length) {
        return resolve([]);
      }
      return gulp.src(groupSource, option).on('data', function(item) {
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
        source = normalizePathToArray(source);
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

  Updater = (function() {
    class Updater {
      /*
      clean_()
      execute_(arg...)
      getLatestVersion_(name)
      listPkg_(list, isDev)
      */
      async clean_() {
        return (await $.clean_(this.pathCache));
      }

      async execute_(...arg) {
        var data;
        data = (await $.read_('./package.json'));
        await $.chain(this).listPkg_(data.dependencies, false).listPkg_(data.devDependencies, true);
        if (!this.listCmd.length) {
          $.info('update', 'everything is ok');
          await this.clean_();
          return this;
        }
        await $.exec_(this.listCmd);
        await this.clean_();
        return this;
      }

      async getLatestVersion_(name) {
        var status, version;
        this.cache || (this.cache = (await $.read_(this.pathCache)));
        this.cache || (this.cache = {});
        version = this.cache[name];
        if (version) {
          return version;
        }
        [status, version] = (await $.exec_(`npm view ${name} version`, {
          silent: true
        }));
        if (!status) {
          throw new Error(version);
        }
        this.cache[name] = version;
        await $.write_(this.pathCache, this.cache);
        return version; // return
      }

      async listPkg_(list, isDev) {
        var lineCmd, name, version, versionCurrent, versionLatest;
        for (name in list) {
          version = list[name];
          versionCurrent = version.replace(/[~^]/, '');
          $.info.pause(this.namespace);
          versionLatest = (await this.getLatestVersion_(name));
          $.info.resume(this.namespace);
          if (versionCurrent === versionLatest) {
            $.info('update', `'${name}': '${versionCurrent}' == '${versionLatest}'`);
            continue;
          }
          $.info('update', `'${name}': '${versionCurrent}' ${kleur.green('->')} '${versionLatest}'`);
          lineCmd = ['cnpm install', `${name}@${versionLatest}`, isDev ? '' : '--production', isDev ? '--save-dev' : '--save'].join(' ');
          lineCmd = lineCmd.replace(/\s{2,}/g, ' ');
          this.listCmd.push(lineCmd);
        }
        return this;
      }

    };

    /*
    cache
    listCmd
    namespace
    pathCache
    */
    Updater.prototype.cache = null;

    Updater.prototype.listCmd = [];

    Updater.prototype.namespace = '$.update_';

    Updater.prototype.pathCache = './temp/cache-update.json';

    return Updater;

  }).call(this);

  
  // return
  $.update_ = async function(...arg) {
    var m;
    m = new Updater();
    await m.execute_(...arg);
    return $; // return
  };

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
        return callback(_.merge(item, {
          path: normalizePath(item.path)
        }));
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
    source = normalizePathToArray(source);
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
  delay_([time])
  reload(source)
  watch(source)
  yargs()
  */
  $.delay_ = async function(time = 0) {
    await new Promise(function(resolve) {
      return setTimeout(function() {
        return resolve();
      }, time);
    });
    $.info('delay', `delayed '${time} ms'`);
    return $; // return
  };

  $.reload = function(source) {
    var livereload;
    if (!source) {
      throw new Error('invalid source');
    }
    source = normalizePathToArray(source);
    // require
    livereload = getPlugin('gulp-livereload');
    livereload.listen();
    $.watch(source).pipe(livereload());
    return $; // return
  };

  $.watch = getPlugin('gulp-watch');

  $.yargs = getPlugin('yargs');

  $.argv = $.plugin.yargs.argv;

  listKey = ['backup', 'compile', 'copy', 'delay', 'download', 'exec', 'isExisted', 'isSame', 'link', 'lint', 'mkdir', 'move', 'read', 'recover', 'remove', 'rename', 'say', 'source', 'stat', 'update', 'walk', 'write', 'zip'];

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
