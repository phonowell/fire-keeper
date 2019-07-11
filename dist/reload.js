var $;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

$.watch = require('../dist/watch');

module.exports = function(source) {
  var livereload;
  if (!source) {
    throw new Error('reload/error: invalid source');
  }
  source = $.normalizePathToArray(source);
  // require
  livereload = require('gulp-livereload');
  livereload.listen();
  $.watch(source).pipe(livereload());
  return this;
};
