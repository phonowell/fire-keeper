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
  var $, _, excludeInclude, fetchGitHub_, formatArgument, getPlugin, gulp, i, j, key, kleur, len, len1, listKey, normalizePath, normalizePathToArray, path, string, wrapList,
    indexOf = [].indexOf;

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
  add-blank-line()
  build()
  default()
  gurumin()
  kokoro()
  lint()
  noop()
  prune()
  publish()
  update()
  watch()
  */
  $.task('add-blank-line', async function() {
    var cont, i, len, listCont, listSource, source;
    listSource = (await $.source_([
      './**/*.coffee',
      // './**/*.json'
      './**/*.md',
      './**/*.pug',
      './**/*.styl',
      './**/*.txt',
      './**/*.yaml',
      '!**/node_modules/**'
    ]));
    for (i = 0, len = listSource.length; i < len; i++) {
      source = listSource[i];
      cont = $.parseString((await $.read_(source)));
      listCont = cont.split('\n');
      if (!_.trim(listCont[listCont.length - 1]).length) {
        continue;
      }
      listCont.push('');
      cont = listCont.join('\n');
      await $.write_(source, cont);
    }
    return $; // return
  });

  $.task('build', async function() {
    await $.build_();
    return $; // return
  });

  $.task('default', async function() {
    var list, name;
    list = _.keys(gulp._registry._tasks);
    list.sort();
    $.info('task', wrapList(list));
    name = (await $.prompt_({
      id: 'default-gulp',
      type: 'autocomplete',
      list: list,
      message: 'task'
    }));
    if (indexOf.call(list, name) < 0) {
      throw new Error(`invalid task '${name}'`);
    }
    await $.task(name)();
    return $; // return
  });

  $.task('gurumin', async function() {
    await fetchGitHub_('phonowell/gurumin');
    await $.chain($).remove_('./gurumin').copy_('./../gurumin/source/**/*', './gurumin');
    return $; // return
  });

  $.task('kokoro', async function() {
    var LIST, filename, i, isSame, len, listClean, source, target;
    await fetchGitHub_('phonowell/kokoro');
    // clean
    listClean = ['./coffeelint.yaml', './coffeelint.yml', './stylint.yaml', './stylintrc.yml'];
    $.info.pause('kokoro');
    await $.remove_(listClean);
    $.info.resume('kokoro');
    // copy
    LIST = ['.gitignore', '.npmignore', '.stylintrc', 'coffeelint.json', 'license.md', 'tslint.json'];
    for (i = 0, len = LIST.length; i < len; i++) {
      filename = LIST[i];
      source = `./../kokoro/${filename}`;
      target = `./${filename}`;
      isSame = (await $.isSame_([source, target]));
      if (isSame === true) {
        continue;
      }
      await $.copy_(source, './');
      await $.exec_(`git add -f ${$.path.base}/${filename}`);
    }
    return $; // return
  });

  $.task('lint', async function() {
    return (await $.lint_(['./**/*.coffee', './**/*.md', './**/*.pug', './**/*.styl', './**/*.ts', '!**/node_modules/**', '!**/gurumin/**', '!**/nib/**']));
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
    await $.remove_(listSource);
    return $; // return
  });

  $.task('publish', async function() {
    await $.exec_(['nrm use npm', 'npm publish', 'nrm use taobao']);
    return $; // return
  });

  $.task('update', async function() {
    var registry;
    ({registry} = $.argv);
    await $.update_({registry});
    return $; // return
  });

  $.task('watch', function() {
    $._watch();
    return $; // return
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
    source = source.replace(/\\/g, '/');
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

  
  // important, never change
  listKey = ['_watch', 'backup_', 'build_', 'clean_', 'compile_', 'copy_', 'delay_', 'download_', 'exec_', 'isExisted_', 'isSame_', 'link_', 'lint_', 'mkdir_', 'move_', 'prompt_', 'read_', 'recover_', 'remove_', 'rename_', 'say_', 'source_', 'ssh', 'stat_', 'update_', 'walk_', 'write_', 'zip_'];

  for (i = 0, len = listKey.length; i < len; i++) {
    key = listKey[i];
    (function(key) {
      // function
      return $[key] = key[key.length - 1] !== '_' ? function(...arg) {
        var fn;
        fn = require(`./build/${key}.js`);
        fn = $[key] = fn($);
        return fn(...arg);
      // async function
      } : async function(...arg) {
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

}).call(this);
