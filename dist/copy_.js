var $, gulp, gulpIf, using;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.normalizePath = require('../dist/normalizePath');

$.wrapList = require('../dist/wrapList');

$.parseString = require('../dist/parseString');

$.info = require('../dist/info');

gulp = require('gulp');

gulpIf = require('gulp-if');

using = require('gulp-using');

module.exports = async function(...arg) {
  var msg, option, source, target;
  // source, target, [option]
  [source, target, option] = (function() {
    switch (arg.length) {
      case 2:
        return [arg[0], arg[1], null];
      case 3:
        return arg;
      default:
        throw new Error('copy_/error: invalid argument length');
    }
  })();
  source = $.normalizePathToArray(source);
  target = $.normalizePath(target);
  if (!source.length) {
    return this;
  }
  await new Promise(function(resolve) {
    var rename;
    // require
    rename = require('gulp-rename');
    return gulp.src(source, {
      allowEmpty: true
    }).pipe(using()).pipe(gulpIf(!!option, rename(option))).pipe(gulp.dest(function(e) {
      return target || e.base;
    })).on('end', function() {
      return resolve();
    });
  });
  // info
  msg = `copied ${$.wrapList(source)} to ${$.wrapList(target)}`;
  if (option) {
    msg += `, as '${$.parseString(option)}'`;
  }
  $.info('copy', msg);
  return this;
};
