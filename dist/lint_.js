var $, M, gulp, kleur, using;

$ = {};

$.source_ = require('../dist/source_');

$.getExtname = require('../dist/getExtname');

$.type = require('../dist/type');

$.info = require('../dist/info');

$.i = require('../dist/i');

gulp = require('gulp');

kleur = require('kleur');

using = require('gulp-using');

M = (function() {
  class M {
    // '.ts': 'lintTs_'
    async execute_(source) {
      var extname, i, len, listSource, method;
      listSource = (await $.source_(source));
      for (i = 0, len = listSource.length; i < len; i++) {
        source = listSource[i];
        extname = $.getExtname(source);
        method = this.mapMethod[extname];
        method || (function() {
          throw new Error(`lint_/error: invalid extname '${extname}'`);
        })();
        await this[method](source);
      }
      return this;
    }

    async lintCoffee_(source) {
      await new Promise(function(resolve) {
        var lint;
        lint = require('gulp-coffeelint');
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
        lint = require('markdownlint');
        option = {
          files: source
        };
        return lint(option, function(err, result) {
          var filename, i, item, len, list, listMsg;
          if (err) {
            throw new Error(err);
          }
          for (filename in result) {
            list = result[filename];
            if ('array' !== $.type(list)) {
              continue;
            }
            filename = $.info().renderPath(filename);
            $.i(kleur.magenta(filename));
            for (i = 0, len = list.length; i < len; i++) {
              item = list[i];
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
      return this;
    }

    async lintStyl_(source) {
      await new Promise(function(resolve) {
        var lint;
        lint = require('gulp-stylint');
        // just like coffee
        // also have to put 'on()' before 'pipe()'
        return gulp.src(source).on('end', function() {
          return resolve();
        }).pipe(using()).pipe(lint()).pipe(lint.reporter());
      });
      return this;
    }

  };

  /*
  mapMethod

  execute_(source)
  lintCoffee_(source)
  lintMd_(source)
  lintStyl_(source)
  lintTs_(source)
  */
  M.prototype.mapMethod = {
    '.coffee': 'lintCoffee_',
    '.md': 'lintMd_',
    '.styl': 'lintStyl_'
  };

  return M;

}).call(this);


// lintTs_: (source) ->

//   await new Promise (resolve) ->

//     lint = require 'gulp-tslint'

//     gulp.src source
//     .pipe using()
//     .pipe lint()
//     .pipe lint.report()
//     .on 'end', -> resolve()

//   @ # return

// return
module.exports = async function(...arg) {
  var m;
  m = new M();
  await m.execute_(...arg);
  return this;
};
