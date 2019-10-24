var $, gulp;

$ = {};

$.normalizePathToArray = require('../dist/normalizePathToArray');

gulp = require('gulp');

module.exports = async function(source, option) {
  var groupSource;
  groupSource = $.normalizePathToArray(source);
  option = Object.assign({
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
