var $, gulp, using;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.info = require('../dist/info');

$.isExisted_ = require('../dist/isExisted_');

$.remove_ = require('../dist/remove_');

$.wrapList = require('../dist/wrapList');

$.parseString = require('../dist/parseString');

gulp = require('gulp');

using = require('gulp-using');

module.exports = async function(source, option) {
  var listHistory;
  source = $.normalizePathToArray(source);
  listHistory = [];
  await new Promise(function(resolve) {
    var rename;
    // require
    rename = require('gulp-rename');
    return gulp.src(source).pipe(using()).pipe(rename(option)).pipe(gulp.dest(function(e) {
      listHistory.push(e.history);
      return e.base;
    })).on('end', function() {
      return resolve();
    });
  });
  await $.info().silence_(async function() {
    var i, item, len, results;
    results = [];
    for (i = 0, len = listHistory.length; i < len; i++) {
      item = listHistory[i];
      if ((await $.isExisted_(item[1]))) {
        results.push((await $.remove_(item[0])));
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
  $.info('file', `renamed ${$.wrapList(source)} as '${$.parseString(option)}'`);
  return this;
};
