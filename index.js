(function() {
  // require
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
  var $, SSH, _, excludeInclude, fetchGitHub_, formatArgument, getPlugin, gulp, i, j, k, key, kleur, len, len1, len2, listKey, normalizePath, normalizePathToArray, path, string, wrapList;

  path = require('path');

  gulp = require('gulp');

  kleur = require('kleur');

  $ = require('estus-flask');

  ({_} = $);

  // variable
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

  $.plugin = {};

  // return
  module.exports = $;

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
    var base1;
    if (name === 'uglify') {
      return (base1 = $.plugin).uglify || (base1.uglify = (function() {
        var composer, uglifyEs;
        uglifyEs = require('uglify-es');
        composer = require('gulp-uglify/composer');
        return composer(uglifyEs, console);
      })());
    }
    throw new Error(`invalid plugin '${name}'`);
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
    // return
    return _.trimEnd(string, '/');
  };

  normalizePathToArray = function(source) {
    var groupSource, i, len, results;
    groupSource = formatArgument(source);
    results = [];
    for (i = 0, len = groupSource.length; i < len; i++) {
      source = groupSource[i];
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
  $.fn = {excludeInclude, formatArgument, getPlugin, normalizePath, normalizePathToArray, wrapList};

  /*
  fn.require(source)
  */
  $.fn.require = function(source) {
    return require(normalizePath(source));
  };

  /*
  reload(source)
  watch(source)
  yargs()
  */
  $.reload = function(source) {
    var livereload;
    if (!source) {
      throw new Error('invalid source');
    }
    source = normalizePathToArray(source);
    // require
    livereload = require('gulp-livereload');
    livereload.listen();
    $.watch(source).pipe(livereload());
    return $; // return
  };

  $.watch = require('gulp-watch');

  $.yargs = require('yargs');

  $.argv = $.yargs.argv;

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
    return (await $.chain($).remove_('./gurumin').copy_('./../gurumin/source/**/*', './gurumin'));
  });

  $.task('kokoro', async function() {
    var LIST, filename, i, isSame, len, listClean, results, source, target;
    await fetchGitHub_('phonowell/kokoro');
    // clean
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    await $.remove_(listClean);
    $.info.resume('kokoro');
    // copy
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md'];
    results = [];
    for (i = 0, len = LIST.length; i < len; i++) {
      filename = LIST[i];
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
    // await $.exec_ 'npm prune'
    base = './node_modules';
    // file
    listFile = ['.DS_Store', '.appveyor.yml', '.babelrc', '.coveralls.yml', '.documentup.json', '.editorconfig', '.eslintignore', '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.flowconfig', '.gitattributes', '.gitlab-ci.yml', '.htmllintrc', '.jshintrc', '.lint', '.npmignore', '.stylelintrc', '.stylelintrc.js', '.stylelintrc.json', '.stylelintrc.yaml', '.stylelintrc.yml', '.tern-project', '.travis.yml', '.yarn-integrity', '.yarn-metadata.json', '.yarnclean', '.yo-rc.json', 'AUTHORS', 'CHANGES', 'CONTRIBUTORS', 'Gruntfile.js', 'Gulpfile.js', 'LICENCE', 'LICENCE-MIT', 'LICENCE.BSD', 'LICENCE.txt', 'LICENSE', 'LICENSE-MIT', 'LICENSE.BSD', 'LICENSE.txt', 'Makefile', '_config.yml', 'appveyor.yml', 'changelog', 'circle.yml', 'eslint', 'gulpfile.js', 'htmllint.js', 'jest.config.js', 'karma.conf.js', 'licence', 'license', 'stylelint.config.js', 'tsconfig.json'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listFile.length; i < len; i++) {
        line = listFile[i];
        results.push(`${base}/**/${line}`);
      }
      return results;
    })();
    await $.remove_(listSource);
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
    await $.remove_(listSource);
    // extension
    listExtension = ['.coffee', '.jst', '.markdown', '.md', '.mkd', '.swp', '.tgz', '.ts'];
    listSource = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = listExtension.length; i < len; i++) {
        line = listExtension[i];
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

  $.chain = function(...arg) {
    var fn;
    fn = require('achain');
    return fn(...arg);
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
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
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
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          src = source[i];
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
          var filename, i, len, src, stat;
          if (err) {
            throw err;
          }
          for (i = 0, len = source.length; i < len; i++) {
            src = source[i];
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
        var i, len, listSource, relativeTarget, src, stat;
        listSource = [];
        await $.walk_(source, function(item) {
          return listSource.push(item.path);
        });
        for (i = 0, len = listSource.length; i < len; i++) {
          src = listSource[i];
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

  // important, never change
  listKey = ['backup_', 'clean_', 'compile_', 'copy_', 'delay_', 'download_', 'exec_', 'isExisted_', 'isSame_', 'link_', 'lint_', 'mkdir_', 'move_', 'prompt_', 'read_', 'recover_', 'remove_', 'rename_', 'say_', 'source_', 'stat_', 'update_', 'walk_', 'write_', 'zip_'];

  for (i = 0, len = listKey.length; i < len; i++) {
    key = listKey[i];
    (function(key) {
      return $[key] = async function(...arg) {
        var fn, fn_;
        fn = require(`./build/${key}.js`);
        fn_ = $[key] = fn($);
        return (await fn_(...arg));
      };
    })(key);
  }

  listKey = ['backup', 'compile', 'copy', 'delay', 'download', 'exec', 'isExisted', 'isSame', 'link', 'lint', 'mkdir', 'move', 'prompt', 'read', 'recover', 'remove', 'rename', 'say', 'source', 'stat', 'update', 'walk', 'write', 'zip'];

  for (j = 0, len1 = listKey.length; j < len1; j++) {
    key = listKey[j];
    $[`${key}Async`] = $[`${key}_`];
  }

  // ssh
  listKey = ['connect', 'disconnect', 'exec', 'mkdir', 'remove', 'upload', 'uploadDir', 'uploadFile'];

  for (k = 0, len2 = listKey.length; k < len2; k++) {
    key = listKey[k];
    $.ssh[`${key}Async`] = $.ssh[`${key}_`];
  }

}).call(this);
