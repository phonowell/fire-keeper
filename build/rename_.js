(function() {
  module.exports = function($) {
    var gulp, normalizePathToArray, using, wrapList;
    ({normalizePathToArray, wrapList} = $.fn);
    gulp = require('gulp');
    using = require('gulp-using');
    
    // return
    return $.rename_ = async function(source, option) {
      var i, item, len, listHistory;
      source = normalizePathToArray(source);
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
      $.info.pause('$.rename_');
      for (i = 0, len = listHistory.length; i < len; i++) {
        item = listHistory[i];
        if ((await $.isExisted_(item[1]))) {
          await $.remove_(item[0]);
        }
      }
      $.info.resume('$.rename_');
      $.info('file', `renamed ${wrapList(source)} as '${$.parseString(option)}'`);
      return $; // return
    };
  };

}).call(this);
