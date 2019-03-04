(function() {
  module.exports = function($) {
    var _, gulp, normalizePathToArray;
    ({_} = $);
    ({normalizePathToArray} = $.fn);
    gulp = require('gulp');
    
    // path = require 'path'

    // return
    return $.source_ = async function(source, option) {
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
  };

}).call(this);
